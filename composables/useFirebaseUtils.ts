export function useFirebaseUtils() {
	const { $firestore: database } = useNuxtApp()

	// Waits for Firestore to be initialized.
	const waitForFirestore = async () => {
		if (!database) {
			await new Promise((resolve) => setTimeout(resolve, 1000))
			if (!database) {
				throw new Error('Firebase not initialized')
			}
		}
		return database
	}

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

		return docs
	}

	// Transforms a DocumentSnapshot into a JavaScript object
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

	// Fetches all videos from a YouTube playlist
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

	return {
		waitForFirestore,
		snapshotResultToArray,
		documentSnapshotToObject,
		getVideoFullDetails,
		getAllVideosFromPlaylist,
	}
}
