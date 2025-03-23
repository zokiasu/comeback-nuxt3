import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
	getDoc,
} from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { useFirebaseUtils } from '~/composables/useFirebaseUtils'

export function useFirebaseArtistPending() {
	const { $firestore: database } = useNuxtApp()
	const toast = useToast()
	const { snapshotResultToArray, documentSnapshotToObject } = useFirebaseUtils()

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
					taskId: snapshot.docs[artists.indexOf(artist)].id,
					groups: snapshotResultToArray(groupsSnapshot),
					members: snapshotResultToArray(membersSnapshot),
				}
			}),
		)

		return artistsWithSubCollections
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
				taskId: snapshot.id,
				groups: snapshotResultToArray(groupsSnapshot),
				members: snapshotResultToArray(membersSnapshot),
			}
		} catch (error) {
			console.error('Error getting pending artist:', error)
			return null
		}
	}

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

	return {
		getAllPendingArtists,
		createPendingArtist,
		getPendingArtistById,
		updatePendingArtist,
		deletePendingArtist,
	}
}
