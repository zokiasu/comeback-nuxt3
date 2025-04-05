import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
	query,
	where,
	onSnapshot,
	orderBy,
	limit,
	getDoc,
	Timestamp,
} from 'firebase/firestore'

import { useFirebaseRelease } from '~/composables/useFirebaseRelease'
import { useFirebaseUtils } from '~/composables/useFirebaseUtils'
import type { Artist } from '~/types/artist'

export function useFirebaseArtist() {
	const { $firestore: database } = useNuxtApp()
	const { getReleaseByArtistIdYoutubeMusic, getReleasesByArtistId } = useFirebaseRelease()
	const { snapshotResultToArray, documentSnapshotToObject } = useFirebaseUtils()
	const toast = useToast()

	// Verify if an artist exist in the 'artists' collection in Firestore with idYoutubeMusic field.
	const artistExistInFirebase = async (idYoutubeMusic: string): Promise<boolean> => {
		const colRef = query(
			collection(database as any, 'artists'),
			where('idYoutubeMusic', '==', idYoutubeMusic),
		)
		const snapshot = await getDocs(colRef)
		return snapshot.size > 0
	}

	// Create a new artist in the 'artists' collection in Firestore
	const createArtist = async (data: Artist) => {
		if (await artistExistInFirebase(data.idYoutubeMusic)) {
			toast.error('This artist already exists in the database.')
			return null
		}

		// Suppression des clés de groupes et de membres pour la création initiale de l'artiste
		const artistData = { ...data }
		if (artistData.groups) delete artistData?.groups
		if (artistData.members) delete artistData?.members

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

	// Delete an artist and all related documents
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

	// Fetches all artists from the 'artists' collection in Firestore.
	const getAllArtists = async () => {
		const colRef = collection(database as any, 'artists')
		const snapshot = await getDocs(colRef)
		return snapshotResultToArray(snapshot)
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

	// Fetches an artist by its ID from the 'artists' collection in Firestore.
	const getArtistByIdLight = async (idArtist: string) => {
		const docRef = doc(database as any, 'artists', idArtist)
		const docSnap = await getDoc(docRef)

		return documentSnapshotToObject(docSnap)
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

	return {
		artistExistInFirebase,
		createArtist,
		updateArtist,
		deleteArtist,
		handleArtistGroups,
		handleArtistMembers,
		getArtistByIdWithGroupsAndMembers,
		getRealtimeLastestArtistsAdded,
		getArtistByIdLight,
		getFullArtistById,
		getAllArtists,
	}
}
