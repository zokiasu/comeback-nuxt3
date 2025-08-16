export interface PlaylistItem {
	videoId: string
	title: string
	artist: string
	addedAt: Date
}

export const usePlaylist = () => {
	const playlist = useState<PlaylistItem[]>('playlist', () => [])
	const currentIndex = useState<number>('currentPlaylistIndex', () => -1)
	const isPlaylistActive = useState<boolean>('isPlaylistActive', () => false)

	const { playMusic, stopMusic } = useYouTube()

	const addToPlaylist = (videoId: string, title: string, artist: string) => {
		console.log('🎵 Ajout à la playlist:', { videoId, title, artist })

		if (!videoId) {
			console.error("❌ ID vidéo manquant pour l'ajout à la playlist")
			return false
		}

		const newItem: PlaylistItem = {
			videoId,
			title: title || 'Titre inconnu',
			artist: artist || 'Artiste inconnu',
			addedAt: new Date(),
		}

		const isFirstItem = playlist.value.length === 0
		playlist.value.push(newItem)

		// Afficher la notification de succès
		const toast = useToast()
		const musicName = title || 'Titre inconnu'
		toast.add({
			title: `${musicName} a été ajouté à la playlist avec succès`,
			color: 'success',
			duration: 1000,
			progress: false,
			ui: {
				root: 'bg-cb-secondary-950 rounded-lg',
				title: 'text-white text-center font-medium',
			},
		})

		if (isFirstItem) {
			console.log('🎵 Première musique - lecture immédiate')
			currentIndex.value = 0
			isPlaylistActive.value = true
			return playMusic(videoId, title, artist)
		} else {
			console.log(`🎵 Musique ajoutée à la position ${playlist.value.length - 1}`)
			return true
		}
	}

	const playNext = () => {
		if (!isPlaylistActive.value || playlist.value.length === 0) {
			console.log('🎵 Playlist inactive ou vide')
			return false
		}

		const nextIndex = currentIndex.value + 1

		if (nextIndex >= playlist.value.length) {
			console.log('🎵 Fin de playlist - arrêt du lecteur')
			clearPlaylist()
			stopMusic()
			return false
		}

		const nextItem = playlist.value[nextIndex]
		currentIndex.value = nextIndex

		console.log(
			`🎵 Lecture suivante (${nextIndex + 1}/${playlist.value.length}):`,
			nextItem,
		)
		return playMusic(nextItem.videoId, nextItem.title, nextItem.artist)
	}

	const playPrevious = () => {
		if (!isPlaylistActive.value || playlist.value.length === 0) {
			console.log('🎵 Playlist inactive ou vide')
			return false
		}

		const previousIndex = currentIndex.value - 1

		if (previousIndex < 0) {
			console.log('🎵 Début de playlist atteint')
			return false
		}

		const previousItem = playlist.value[previousIndex]
		currentIndex.value = previousIndex

		console.log(
			`🎵 Lecture précédente (${previousIndex + 1}/${playlist.value.length}):`,
			previousItem,
		)
		return playMusic(previousItem.videoId, previousItem.title, previousItem.artist)
	}

	const playAtIndex = (index: number) => {
		if (!isPlaylistActive.value || index < 0 || index >= playlist.value.length) {
			console.error('❌ Index invalide ou playlist inactive')
			return false
		}

		const item = playlist.value[index]
		currentIndex.value = index

		console.log(`🎵 Lecture à l'index ${index}:`, item)
		return playMusic(item.videoId, item.title, item.artist)
	}

	const removeFromPlaylist = (index: number) => {
		if (index < 0 || index >= playlist.value.length) {
			console.error('❌ Index invalide pour suppression')
			return false
		}

		const removedItem = playlist.value[index]
		playlist.value.splice(index, 1)

		if (index === currentIndex.value) {
			if (playlist.value.length === 0) {
				clearPlaylist()
				stopMusic()
			} else if (index >= playlist.value.length) {
				currentIndex.value = playlist.value.length - 1
			}
		} else if (index < currentIndex.value) {
			currentIndex.value -= 1
		}

		console.log('🎵 Supprimé de la playlist:', removedItem)
		return true
	}

	const clearPlaylist = () => {
		console.log('🎵 Vidage de la playlist')
		playlist.value = []
		currentIndex.value = -1
		isPlaylistActive.value = false
	}

	const skipToNext = () => {
		return playNext()
	}

	const skipToPrevious = () => {
		return playPrevious()
	}

	const getCurrentItem = () => {
		if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
			return playlist.value[currentIndex.value]
		}
		return null
	}

	const hasNext = () => {
		return isPlaylistActive.value && currentIndex.value < playlist.value.length - 1
	}

	const hasPrevious = () => {
		return isPlaylistActive.value && currentIndex.value > 0
	}

	const getPlaylistInfo = () => {
		return {
			total: playlist.value.length,
			current: currentIndex.value + 1,
			hasNext: hasNext(),
			hasPrevious: hasPrevious(),
			isActive: isPlaylistActive.value,
		}
	}

	return {
		// États
		playlist: readonly(playlist),
		currentIndex: readonly(currentIndex),
		isPlaylistActive: readonly(isPlaylistActive),

		// Actions principales
		addToPlaylist,
		playNext,
		playPrevious,
		playAtIndex,
		removeFromPlaylist,
		clearPlaylist,

		// Actions de navigation
		skipToNext,
		skipToPrevious,

		// Utilitaires
		getCurrentItem,
		hasNext,
		hasPrevious,
		getPlaylistInfo,
	}
}
