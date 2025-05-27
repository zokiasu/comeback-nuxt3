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
		getReleasesByArtistId,
		updateUserData,
		getUserData,
	}
}
