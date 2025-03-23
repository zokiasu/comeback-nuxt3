import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
	Timestamp,
	query,
	where,
	getDoc,
} from 'firebase/firestore'
import { useFirebaseUtils } from '~/composables/useFirebaseUtils'
import { useFirebaseMusic } from '~/composables/useFirebaseMusic'

export function useFirebaseRelease() {
	const { $firestore: database } = useNuxtApp()
	const { waitForFirestore, snapshotResultToArray } = useFirebaseUtils()
	const { deleteMusic } = useFirebaseMusic()

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

	// Fetches a release by its ID with musics from the 'releases' collection in Firestore.
	const getReleaseByIdWithMusics = async (id: string) => {
		const db = await waitForFirestore()
		const colRef = query(collection(db, 'releases'), where('idYoutubeMusic', '==', id))
		const colMusic = query(collection(db, 'releases', id, 'musics'))

		const snapshot = await getDocs(colRef)
		const snapshotMusic = await getDocs(colMusic)

		const release = snapshotResultToArray(snapshot)
		if (release.length > 0) {
			release[0].musics = snapshotResultToArray(snapshotMusic)
			return release[0]
		}
		return null
	}

	// Fetches releases by a specific artist from the'releases' collection in Firestore.
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

	// Updates a document in the 'releases' collection in Firestore.
	const updateRelease = async (id: string, data: any): Promise<string> => {
		const docRef = doc(database as any, 'releases', id)
		try {
			// const musics = { ...data.musics }

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

	return {
		getAllReleases,
		getReleaseByArtistIdYoutubeMusic,
		getReleaseById,
		getReleaseByIdWithMusics,
		getReleasesByArtistId,
		updateRelease,
		deleteRelease,
	}
}
