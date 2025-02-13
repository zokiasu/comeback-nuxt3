import {
	collection,
	getDoc,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
	Timestamp,
	query,
	where,
	orderBy,
	limit,
	getCountFromServer,
	onSnapshot,
	startAt,
	endAt,
	startAfter,
	endBefore,
	QueryConstraint,
} from 'firebase/firestore'
import _ from 'lodash'
import { useToast } from 'vue-toastification'
import type { Artist } from '~/types/artist'
import type { Music } from '~/types/music'

export function useFirebaseFunction() {
	const { $firestore: database } = useNuxtApp()
	const { shuffleArray } = useGeneralFunction()
	const config = useRuntimeConfig()
	const userStore = useUserStore()
	const toast = useToast()

	/// ////// GENERAL FUNCTION FOR FIREBASE FUNCTION \\\\\\\\\\

	// Converts a Firestore snapshot into an array of documents.
	const snapshotResultToArray = (result: any) => {
		if (!result?.docs) return []

		const docs = Array.from(result.docs)
			.map((doc: any) => {
				if (!doc) return null
				return {
					id: doc.id,
					...doc.data(),
				}
			})
			.filter(Boolean)

		return docs.filter(
			(doc: any, index: number, self: any) =>
				self.findIndex((t: any) => t?.id === doc?.id) === index,
		)
	}
	// Transforme un DocumentSnapshot en objet JavaScript
	const documentSnapshotToObject = (docSnap: any) => {
		if (!docSnap?.exists()) return null
		try {
			const data = docSnap.data()
			return { id: docSnap.id, ...data }
		} catch (error) {
			console.error('Erreur lors de la conversion du document:', error)
			return null
		}
	}
	// Fetches details of a YouTube video using the YouTube Data API.
	// const getVideoDetails = async (videoId: string, apiKey: string) => {
	//   const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,status&key=${apiKey}`

	//   try {
	//     const response = await fetch(url)
	//     const data = await response.json()
	//     return (data.items && data.items.length) ? data.items[0] : null
	//   } catch (error) {
	//     console.error('Erreur lors de la récupération des détails de la vidéo:', error)
	//     return null
	//   }
	// }
	// Fetches details of a YouTube video using the YouTube Data API.
	const getVideoFullDetails = async (videoId: string, apiKey: string) => {
		const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,status&key=${apiKey}`

		try {
			const response = await fetch(url)
			const data = await response.json()
			return data.items && data.items.length ? data.items[0] : null
		} catch (error) {
			console.error('Erreur lors de la récupération des détails de la vidéo:', error)
			return null
		}
	}

	const getAllVideosFromPlaylist = async (playlistId: string, apiKey: string) => {
		const baseUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems`
		let allItems: any[] = []
		let pageToken = ''

		try {
			do {
				const url = `${baseUrl}?part=snippet,contentDetails,id,status&playlistId=${playlistId}&key=${apiKey}&maxResults=50&pageToken=${pageToken}`
				const response = await fetch(url)
				const data = await response.json()

				if (data.items) {
					allItems = allItems.concat(data.items)
				}

				pageToken = data.nextPageToken
			} while (pageToken)

			return allItems
		} catch (error) {
			console.error('Erreur lors de la récupération des vidéos de la playlist:', error)
			return null
		}
	}

	// Checks if a YouTube video can be embedded.
	// const canVideoBeEmbedded = async (videoId: string, apiKey: string) => {
	//   const videoDetails = await getVideoDetails(videoId, apiKey)

	//   if (!videoDetails) {
	//     return false
	//   }

	//   const isEmbeddable = videoDetails.status.embeddable
	//   const hasRestriction = videoDetails.contentDetails.regionRestriction

	//   return isEmbeddable && !hasRestriction
	// }
	// Verify if an artist exist in the 'artists' collection in Firestore with idYoutubeMusic field.
	const artistExistInFirebase = async (idYoutubeMusic: string) => {
		const colRef = query(
			collection(database as any, 'artists'),
			where('idYoutubeMusic', '==', idYoutubeMusic),
		)
		const snapshot = await getDocs(colRef)
		return snapshot.size > 0
	}

	/// ////// HOMEPAGE FUNCTION \\\\\\\\\\

	// Listens for real-time updates to the 'news' collection in Firestore where the date is greater than or equal to the provided start date.
	const getRealtimeNextComebacks = async (startDate: Timestamp, callback: Function) => {
		const colRef = query(
			collection(database as any, 'news'),
			where('date', '>=', startDate),
			orderBy('date', 'asc'),
		)

		// Écoute en temps réel des modifications dans la collection
		const unsubscribe = onSnapshot(colRef, (snapshot) => {
			const comebacks = snapshotResultToArray(snapshot)
			callback(comebacks)
		})

		// Retourne la fonction pour se désabonner de l'écouteur
		return unsubscribe
	}
	// Listens for real-time updates to the 'releases' collection in Firestore where the date is greater than or equal to the provided start date and needToBeVerified is false.
	const getRealtimeLastestReleases = async (
		startDate: Timestamp,
		limitNumber: number,
		callback: Function,
	) => {
		const colRef = query(
			collection(database as any, 'releases'),
			// where('date', '>=', startDate),
			where('needToBeVerified', '==', false),
			orderBy('date', 'desc'),
			limit(limitNumber),
		)

		// Écoute en temps réel des modifications dans la collection
		const unsubscribe = onSnapshot(colRef, (snapshot) => {
			const releases = snapshotResultToArray(snapshot)
			callback(releases)
		})

		// Retourne la fonction pour se désabonner de l'écouteur
		return unsubscribe
	}
	// Listens for real-time updates to the 'artists' collection in Firestore.
	const getRealtimeLastestArtistsAdded = async (
		limitNumber: number,
		callback: Function,
	) => {
		const colRef = query(
			collection(database as any, 'artists'),
			orderBy('createdAt', 'desc'),
			limit(limitNumber),
		)

		// Écoute en temps réel des modifications dans la collection
		const unsubscribe = onSnapshot(colRef, (snapshot) => {
			const artists = snapshotResultToArray(snapshot)
			callback(artists)
		})

		// Retourne la fonction pour se désabonner de l'écouteur
		return unsubscribe
	}
	// Fetches a random music release from the 'releases' collection in Firestore.
	const getRandomMusic = async (
		year?: number,
		limitCount: number = 100,
		noLimit: boolean = false,
	): Promise<any> => {
		let colRef
		try {
			const constraints = [
				orderBy('date', 'desc'),
				year ? where('year', '==', year) : null,
				noLimit ? null : limit(limitCount),
			].filter(Boolean) as QueryConstraint[]

			colRef = query(collection(database as any, 'musics'), ...constraints)
			const snapshot = await getDocs(colRef)
			const musics = snapshot.docs.map((doc) => doc.data())

			const randomIndexes = Array.from({ length: 5 }, () =>
				Math.floor(Math.random() * musics.length),
			)
			const randomMusics = randomIndexes.map((index) => musics[index])

			for (const music of randomMusics) {
				if (
					!music.name.toLowerCase().includes('inst') &&
					!music.name.toLowerCase().includes('sped-up')
				) {
					return music
				}
			}

			return getRandomMusic(year, limitCount, noLimit)
		} catch (error) {
			console.error('Erreur lors de la récupération de la musique aléatoire:', error)
			throw error
		}
	}

	// return a list of 10 random music from list release id
	const getRandomMusicFromArtistId = async (
		artistId: string,
		artistName: string,
	): Promise<Music[]> => {
		try {
			// Recherche sur un champ imbriqué spécifique
			const constraints = [
				where('artists', 'array-contains', {
					artistId,
					name: artistName, // On remet le name car il fait partie de la structure
				}),
			] as QueryConstraint[]

			const colRef = query(collection(database as any, 'musics'), ...constraints)
			const snapshot = await getDocs(colRef)

			const musics = snapshot.docs.map((doc) => {
				const data = doc.data()
				return {
					id: doc.id,
					...data,
				} as Music
			})

			const filteredMusics = musics.filter(
				(music) =>
					!music.name.toLowerCase().includes('inst') &&
					!music.name.toLowerCase().includes('sped-up'),
			)

			return shuffleArray(filteredMusics).slice(0, 5)
		} catch (error) {
			console.error('Erreur complète:', error)
			throw error
		}
	}

	/// ////// CALENDAR PAGE FUNCTION \\\\\\\\\\

	// Fetches releases between two dates from the 'releases' collection in Firestore.
	const getReleasesBetweenDates = async (startDate: Timestamp, endDate: Timestamp) => {
		const colRef = query(
			collection(database as any, 'releases'),
			where('date', '>=', startDate),
			where('date', '<=', endDate),
			where('needToBeVerified', '==', false),
			orderBy('date', 'desc'),
		)
		const snapshot = await getDocs(colRef)
		return snapshotResultToArray(snapshot)
	}

	/// ////// Release's Function \\\\\\\\\\

	// Fetches all releases from the 'releases' collection in Firestore.
	const getAllReleases = async () => {
		const colRef = collection(database as any, 'releases')
		const snapshot = await getDocs(colRef)
		return snapshotResultToArray(snapshot)
	}

	// Fetches releases by a specific artist from the 'releases' collection in Firestore.
	const getReleaseByArtistIdYoutubeMusic = async (artistId: string) => {
		const colRef = query(
			collection(database as any, 'releases'),
			where('artistsId', '==', artistId),
		)
		const snapshot = await getDocs(colRef)
		const release = snapshotResultToArray(snapshot)
		return release
	}

	// Fetches a release by its ID from the 'releases' collection in Firestore.
	const getReleaseById = async (id: string) => {
		const colRef = query(
			collection(database as any, 'releases'),
			where('idYoutubeMusic', '==', id),
		)
		const snapshot = await getDocs(colRef)
		const release = snapshotResultToArray(snapshot)
		return release[0]
	}

	// Fetches a release by its ID from the 'releases' collection in Firestore.
	const getReleaseByIdWithMusics = async (id: string) => {
		const colRef = query(
			collection(database as any, 'releases'),
			where('idYoutubeMusic', '==', id),
		)
		const colMusic = query(collection(database as any, 'releases', id, 'musics'))

		const snapshot = await getDocs(colRef)
		const snapshotMusic = await getDocs(colMusic)

		const release = snapshotResultToArray(snapshot)
		if (release.length > 0) {
			release[0].musics = snapshotResultToArray(snapshotMusic)

			return release[0]
		}
		return null
	}

	// Updates a document in the 'releases' collection in Firestore.
	const updateRelease = async (id: string, data: any): Promise<string> => {
		const docRef = doc(database as any, 'releases', id)
		try {
			const musics = { ...data.musics }

			const releaseData = { ...data }
			delete releaseData.musics
			releaseData.updatedAt = Timestamp.fromDate(new Date())

			await updateDoc(docRef, releaseData)

			if (data.date || data.year) {
				await updateMusicsForRelease(id, data)
			}

			return 'success'
		} catch (error) {
			console.error('Erreur lors de la mise à jour du document:', error)
			return 'error'
		}
	}

	// Updates the musics for a release in the 'releases' collection in Firestore.
	const updateMusicsForRelease = async (id: string, data: any) => {
		try {
			const musicsRef = collection(database as any, 'releases', id, 'musics')
			const musicsSnapshot = await getDocs(musicsRef)
			const updatePromises = musicsSnapshot.docs.map(async (musicDoc) => {
				try {
					const musicId = musicDoc.data().videoId
					const musicData = {
						date: data.date,
						year: data.year,
						updatedAt: Timestamp.fromDate(new Date()),
					}

					// Mise à jour dans la collection /musics/videoId/
					const musicRef = doc(database as any, 'musics', musicId)
					const musicDocSnapshot = await getDoc(musicRef)
					if (!musicDocSnapshot.exists()) {
						await setDoc(musicRef, { ...musicData, id: musicId })
					} else {
						await updateDoc(musicRef, musicData)
					}

					// Mise à jour dans la collection /releases/idRelease/musics/idMusic
					await updateDoc(doc(musicsRef, musicDoc.data().id), musicData)
				} catch (error) {
					console.error(
						`Erreur lors de la mise à jour de la musique ${musicDoc.id}:`,
						error,
					)
				}
			})
			await Promise.all(updatePromises)
		} catch (error) {
			console.error('Erreur lors de la mise à jour des musiques pour la sortie:', error)
		}
	}

	// Deletes a document in the 'releases' collection in Firestore.
	const deleteRelease = async (id: string): Promise<string> => {
		const musicsRef = collection(database as any, 'releases', id, 'musics')

		try {
			const snapshot = await getDocs(musicsRef)
			const deleteMusicPromises = snapshot.docs.map((doc) => deleteMusic(doc.id))
			await Promise.all(deleteMusicPromises)

			await deleteDoc(doc(database as any, 'releases', id))
			return 'success'
		} catch (error) {
			console.error('Error removing document:', error)
			return 'error'
		}
	}

	// Deletes a document in the 'musics' collection in Firestore.
	const deleteMusic = async (musicId: string): Promise<string> => {
		const docRef = doc(database as any, 'musics', musicId)

		return await deleteDoc(docRef)
			.then(() => {
				return 'success'
			})
			.catch((error) => {
				console.error('Error removing document:', error)
				return 'error'
			})
	}

	const getAllPendingArtists = async () => {
		const colRef = collection(database as any, 'artistPending')
		const snapshot = await getDocs(colRef)
		const artists = snapshotResultToArray(snapshot)

		const artistsWithSubCollections = await Promise.all(
			artists.map(async (artist) => {
				const [groupsSnapshot, membersSnapshot] = await Promise.all([
					getDocs(collection(database as any, 'artistPending', artist.id, 'groups')),
					getDocs(collection(database as any, 'artistPending', artist.id, 'members')),
				])

				return {
					...artist,
					groups: snapshotResultToArray(groupsSnapshot) || [],
					members: snapshotResultToArray(membersSnapshot) || [],
				}
			}),
		)

		return artistsWithSubCollections as Artist[]
	}

	/// ////// Pending Artist's Function \\\\\\\\\\

	const createPendingArtist = async (data: any) => {
		const groups = data.groups || []
		const members = data.members || []
		delete data.groups
		delete data.members

		const docRef = doc(database as any, 'artistPending')
		await setDoc(docRef, data)
			.then(() => {
				toast.success('Artist pending created')
			})
			.catch((error) => {
				console.error('Error creating artist pending:', error)
			})

		if (groups?.length) {
			const groupsRef = collection(database as any, 'artistPending', docRef.id, 'groups')
			await Promise.all(
				groups.map(async (group: any) => {
					const groupDoc = doc(groupsRef, group.id)
					await setDoc(groupDoc, group)
				}),
			)
		}

		if (members?.length) {
			const membersRef = collection(
				database as any,
				'artistPending',
				docRef.id,
				'members',
			)
			await Promise.all(
				members.map(async (member: any) => {
					const memberDoc = doc(membersRef, member.id)
					await setDoc(memberDoc, member)
				}),
			)
		}
	}

	const getPendingArtistById = async (id: string) => {
		try {
			const docRef = doc(database as any, 'artistPending', id)
			const snapshot = await getDoc(docRef)
			const artist = documentSnapshotToObject(snapshot)
			if (!artist) return null

			const [groupsSnapshot, membersSnapshot] = await Promise.all([
				getDocs(collection(database as any, 'artistPending', id, 'groups')),
				getDocs(collection(database as any, 'artistPending', id, 'members')),
			])

			return {
				...artist,
				groups: snapshotResultToArray(groupsSnapshot) || [],
				members: snapshotResultToArray(membersSnapshot) || [],
			}
		} catch (error) {
			console.error('Error getting pending artist:', error)
			return null
		}
	}

	const updatePendingArtist = async (id: string, data: any) => {
		const groups = data.groups || []
		const members = data.members || []
		delete data.groups
		delete data.members

		const docRef = doc(database as any, 'artistPending', id)
		await updateDoc(docRef, data)

		// Update subcollections if they exist
		if (groups?.length) {
			const groupsRef = collection(database as any, 'artistPending', id, 'groups')
			await Promise.all(
				groups.map(async (group: any) => {
					const groupDoc = doc(groupsRef, group.id)
					await setDoc(groupDoc, group)
				}),
			)
		}

		if (members?.length) {
			const membersRef = collection(database as any, 'artistPending', id, 'members')
			await Promise.all(
				members.map(async (member: any) => {
					const memberDoc = doc(membersRef, member.id)
					await setDoc(memberDoc, member)
				}),
			)
		}
	}

	const deletePendingArtist = async (id: string) => {
		const docRef = doc(database as any, 'artistPending', id)
		await deleteDoc(docRef)
	}

	/// ////// Artist's Function \\\\\\\\\\

	// Fetches all artists from the 'artists' collection in Firestore.
	const getAllArtists = async () => {
		const colRef = collection(database as any, 'artists')
		const snapshot = await getDocs(colRef)
		return snapshotResultToArray(snapshot)
	}

	// Fetches an artist with full details by its ID from the 'artists' collection in Firestore.
	const getFullArtistById = async (idArtist: string) => {
		if (!idArtist) return null

		try {
			const artistDoc = await getDoc(doc(database as any, 'artists', idArtist))
			if (!artistDoc?.exists()) return null

			const artist = documentSnapshotToObject(artistDoc)
			if (!artist) return null

			const [groupsSnapshot, membersSnapshot] = await Promise.all([
				getDocs(collection(database as any, 'artists', idArtist, 'groups')),
				getDocs(collection(database as any, 'artists', idArtist, 'members')),
			])

			const groups = snapshotResultToArray(groupsSnapshot) || []
			const members = snapshotResultToArray(membersSnapshot) || []
			const releases = (await getReleasesByArtistId(idArtist)) || []

			return {
				...artist,
				groups,
				members,
				releases,
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des données de l'artiste:", error)
			return null
		}
	}

	// Fetches an artist with full details by its ID from the 'artists' collection in Firestore.
	const getArtistByIdWithGroupsAndMembers = async (idArtist: string) => {
		const docRef = doc(database as any, 'artists', idArtist)
		const docSnap = await getDoc(docRef)
		const artist = documentSnapshotToObject(docSnap)

		const colGroup = collection(database as any, 'artists', idArtist, 'groups')
		const colMember = collection(database as any, 'artists', idArtist, 'members')

		const snapshotGroup = await getDocs(colGroup)
		const snapshotMember = await getDocs(colMember)

		const groups = snapshotResultToArray(snapshotGroup)
		const members = snapshotResultToArray(snapshotMember)

		artist.groups = groups
		artist.members = members

		return artist
	}

	// Fetches an artist by its ID from the 'artists' collection in Firestore.
	const getArtistByIdLight = async (idArtist: string) => {
		const docRef = doc(database as any, 'artists', idArtist)
		const docSnap = await getDoc(docRef)

		return documentSnapshotToObject(docSnap)
	}

	// Creates a new artist document in the 'artists' collection in Firestore.
	const createArtist = async (data: any) => {
		if (await artistExistInFirebase(data.idYoutubeMusic)) {
			toast.error('This artist already exists in the database.')
			return null
		}

		// Suppression des clés de groupes et de membres pour la création initiale de l'artiste
		const artistData = { ...data }
		delete artistData.groups
		delete artistData.members

		const docRef = await addDoc(collection(database as any, 'artists'), artistData)
		const artistId = docRef.id
		await updateDoc(docRef, { id: artistId })

		// Gestion des groupes et des membres après la création de l'artiste
		if (data.groups) {
			for (const group of data.groups) {
				await setDoc(doc(database as any, 'artists', artistId, 'groups', group.id), group)
				await setDoc(
					doc(database as any, 'artists', group.id, 'members', artistId),
					artistData,
				)
			}
		}

		if (data.members) {
			for (const member of data.members) {
				await setDoc(
					doc(database as any, 'artists', artistId, 'members', member.id),
					member,
				)
				await setDoc(
					doc(database as any, 'artists', member.id, 'groups', artistId),
					artistData,
				)
			}
		}

		return artistId
	}

	// Updates a document in the 'artists' collection in Firestore.
	const updateArtist = async (document: any) => {
		const artistGroups = ref(null)
		const artistMembers = ref(null)

		if (document.groups) {
			artistGroups.value = document.groups
			delete document.groups
		}

		if (document.members) {
			artistMembers.value = document.members
			delete document.members
		}

		if (document.taskId) delete document.taskId
		if (document.createdAt) delete document.createdAt

		document.updatedAt = Timestamp.fromDate(new Date())

		const docRef = doc(database as any, 'artists', document.id)
		await updateDoc(docRef, document)

		// Handle artist groups
		if (artistGroups.value) {
			await handleArtistGroups(database, document, artistGroups)
		}

		// Handle artist members
		if (artistMembers.value) {
			await handleArtistMembers(database, document, artistMembers)
		}
	}

	// Handle artist groups
	const handleArtistGroups = async (database: any, document: any, artistGroups: any) => {
		const colGroup = collection(database, 'artists', document.id, 'groups')
		const snapshot = await getDocs(colGroup)
		const docs = snapshot.docs.map((doc) => doc.data())

		for (const docU of docs) {
			await deleteDoc(doc(database, 'artists', document.id, 'groups', docU.id))
			await deleteDoc(doc(database, 'artists', docU.id, 'members', document.id))
		}

		for (const group of artistGroups.value) {
			await setDoc(doc(database, 'artists', document.id, 'groups', group.id), group)
			const artist = await getArtistByIdLight(document.id)
			await setDoc(doc(database, 'artists', group.id, 'members', artist.id), artist)
		}
	}

	// Handle artist members
	const handleArtistMembers = async (
		database: any,
		document: any,
		artistMembers: any,
	) => {
		const colMember = collection(database, 'artists', document.id, 'members')
		const snapshot = await getDocs(colMember)
		const docs = snapshot.docs.map((doc) => doc.data())

		for (const docU of docs) {
			await deleteDoc(doc(database, 'artists', document.id, 'members', docU.id))
			await deleteDoc(doc(database, 'artists', docU.id, 'groups', document.id))
		}

		for (const member of artistMembers.value) {
			await setDoc(doc(database, 'artists', document.id, 'members', member.id), member)
			const artist = await getArtistByIdLight(document.id)
			await setDoc(doc(database, 'artists', member.id, 'groups', artist.id), artist)
		}
	}

	const deleteArtist = async (id: string) => {
		const releases = await getReleaseByArtistIdYoutubeMusic(id)
		const artistTodelete = await getFullArtistById(id)
		const artistGroups = artistTodelete.groups
		const artistMembers = artistTodelete.members

		for (const release of releases) {
			await deleteDoc(doc(database as any, 'releases', release.idYoutubeMusic)).then(
				() => {
					console.log('Document successfully deleted!', release.name, release.artistName)
				},
			)
		}

		for (const group of artistGroups) {
			await deleteDoc(doc(database as any, 'artists', id, 'groups', group.id)).then(
				() => {
					console.log('Document successfully deleted!', group.name)
				},
			)
			await deleteDoc(doc(database as any, 'artists', group.id, 'members', id))
		}

		for (const member of artistMembers) {
			await deleteDoc(doc(database as any, 'artists', id, 'members', member.id))
			await deleteDoc(doc(database as any, 'artists', member.id, 'groups', id))
		}

		await deleteDoc(doc(database as any, 'artists', id))
	}

	/// ////// Comeback's Function \\\\\\\\\\

	const createStyle = async (newStyle: string, styleFetch: any[]) => {
		await updateDoc(doc(database as any, 'general', 'data'), {
			styles: [
				{
					created: Timestamp.now(),
					name: newStyle,
					createdBy: userStore?.userDataStore?.id ?? '',
				},
				...styleFetch,
			],
		}).then(() => {
			toast.success('Style added')
		})
	}

	const createTag = async (newGeneralTag: string, generalTagFetch: any[]) => {
		await updateDoc(doc(database as any, 'general', 'data'), {
			generalTags: [
				{
					created: Timestamp.now(),
					name: newGeneralTag,
					createdBy: userStore?.userDataStore?.id ?? '',
				},
				...generalTagFetch,
			],
		}).then(() => {
			toast.success('Tag added')
		})
	}

	// Checks if a comeback exists in the 'news' collection in Firestore for a specific artist on a specific date.
	const getComebackExist = async (
		date: Timestamp,
		artistName: string,
	): Promise<boolean> => {
		const today = new Date()
		const todayInTimestamp = Timestamp.fromDate(today)
		const colRef = query(
			collection(database as any, 'news'),
			where('date', '>=', todayInTimestamp),
			orderBy('date', 'asc'),
		)

		try {
			const snapshot = await getDocs(colRef)
			const comebacks = snapshotResultToArray(snapshot)

			return comebacks.some((comeback: any) => {
				const cbDate = new Date(comeback.date.seconds * 1000)
				cbDate.setHours(0, 0, 0, 0)
				const dateToTest = new Date(date.seconds * 1000)
				dateToTest.setHours(0, 0, 0, 0)

				return (
					comeback.artist.name.toLowerCase() === artistName.toLowerCase() &&
					_.isEqual(cbDate, dateToTest)
				)
			})
		} catch (error) {
			console.error("Erreur lors de la vérification de l'existence du comeback:", error)
			return false
		}
	}

	const updateUserData = async (user: any) => {
		user.updatedAt = Timestamp.fromDate(new Date())
		const docRef = doc(database as any, 'users', user.id)
		await updateDoc(docRef, user)
			.then(() => {
				userStore.setUserData(user)
			})
			.catch((error) => {
				console.error('Error updating document:', error)
			})
	}

	const getUserData = (id: string) => {
		const docRef = doc(database as any, 'users', id)
		return new Promise((resolve) => {
			const unsubscribe = onSnapshot(docRef, (docSnap) => {
				const userData = documentSnapshotToObject(docSnap)
				resolve(userData)
			})
			// Retourner la fonction unsubscribe pour permettre l'arrêt de l'écoute si nécessaire
			return unsubscribe
		})
	}

	// Fetches paginated releases from the 'releases' collection in Firestore.
	const getPaginatedReleases = async (
		cursor: any,
		pageSize: number,
		direction: string,
	) => {
		let colRef = query(
			collection(database as any, 'releases'),
			orderBy('date', 'desc'),
			limit(pageSize),
		)

		if (cursor) {
			if (direction === 'next') {
				colRef = query(
					collection(database as any, 'releases'),
					orderBy('date', 'desc'),
					startAfter(cursor),
					limit(pageSize),
				)
			} else if (direction === 'prev') {
				colRef = query(
					collection(database as any, 'releases'),
					orderBy('date', 'desc'),
					endBefore(cursor),
					limit(pageSize),
				)
			}
		}

		const snapshot = await getDocs(colRef)
		const releases = snapshotResultToArray(snapshot)
		const newLastVisible = snapshot.docs[snapshot.docs.length - 1]
		const newFirstVisible = snapshot.docs[0]

		return { releases, newLastVisible, newFirstVisible }
	}

	const getReleasesByArtistId = async (artistId: string) => {
		try {
			// Recherche d'abord par l'ID Firebase
			const colRefById = query(
				collection(database as any, 'releases'),
				where('artistsId', '==', artistId),
			)
			const snapshotById = await getDocs(colRefById)
			const releases = snapshotResultToArray(snapshotById)

			return releases.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
		} catch (error) {
			console.error('Erreur lors de la récupération des releases:', error)
			return []
		}
	}

	return {
		database,
		snapshotResultToArray,
		getRealtimeNextComebacks,
		getRealtimeLastestReleases,
		getRealtimeLastestArtistsAdded,
		getRandomMusicFromArtistId,
		getReleasesBetweenDates,
		getRandomMusic,
		updateRelease,
		getAllReleases,
		getAllArtists,
		getReleaseById,
		getComebackExist,
		getReleaseByArtistIdYoutubeMusic,
		getReleasesByArtistId,
		createArtist,
		updateArtist,
		updateUserData,
		getUserData,
		getFullArtistById,
		getArtistByIdLight,
		getArtistByIdWithGroupsAndMembers,
		deleteRelease,
		// getVideoDetails,
		getVideoFullDetails,
		getAllVideosFromPlaylist,
		deleteArtist,
		getReleaseByIdWithMusics,
		createStyle,
		createTag,
		getPaginatedReleases,
	}
}
