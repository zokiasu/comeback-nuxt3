import {
	collection,
	getDocs,
	doc,
	updateDoc,
	Timestamp,
	query,
	where,
	orderBy,
	limit,
	onSnapshot,
	QueryConstraint,
} from 'firebase/firestore'
import _ from 'lodash'
import { useToast } from 'vue-toastification'
import { useNuxtApp } from '#app'
import type { Music } from '~/types/music'
import { useFirebaseUtils } from '~/composables/useFirebaseUtils'
import { useUserStore } from '@/stores/user'
import { useGeneralFunction } from '@/composables/useGeneralFunction'

export function useFirebaseFunction() {
	const { $firestore: database } = useNuxtApp()
	const { shuffleArray } = useGeneralFunction()
	const { snapshotResultToArray, documentSnapshotToObject } = useFirebaseUtils()
	const userStore = useUserStore()
	const toast = useToast()

	// Listens for real-time updates to the 'news' collection in Firestore where the date is greater than or equal to the provided start date.
	const getRealtimeNextComebacks = async (
		startDate: Timestamp,
		callback: (data: any[]) => void,
	) => {
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
		_startDate: Timestamp,
		limitNumber: number,
		callback: (data: any[]) => void,
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
		callback: (data: any[]) => void,
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

	// Creates a new style in the 'general' collection in Firestore.
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

	// Creates a new general tag in the 'general' collection in Firestore.
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

	// Updates user data in the 'users' collection in Firestore.
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

	// Gets user data from the 'users' collection in Firestore based on the provided ID.
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

	// Fetches releases by a specific artist from the 'releases' collection in Firestore.
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
		getComebackExist,
		getReleasesByArtistId,
		updateUserData,
		getUserData,
		createStyle,
		createTag,
	}
}
