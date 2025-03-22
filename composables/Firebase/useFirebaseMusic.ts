import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	query,
	where,
	orderBy,
	limit,
	QueryConstraint,
} from 'firebase/firestore'
import type { Music } from '~/types/music'

export const useFirebaseMusic = () => {
	const { $firestore: database } = useNuxtApp()
	const { shuffleArray } = useGeneralFunction()

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

	return {
		deleteMusic,
		getRandomMusic,
		getRandomMusicFromArtistId,
	}
}
