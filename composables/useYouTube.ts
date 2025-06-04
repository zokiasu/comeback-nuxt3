export const useYouTube = () => {
	const idYoutubeVideo = useIdYoutubeVideo()
	const isPlayingVideo = useIsPlayingVideo()
	const musicNamePlaying = useMusicNamePlaying()
	const authorNamePlaying = useAuthorNamePlaying()

	// État du lecteur
	const isPlayerLoaded = ref(false)
	const playerError = ref<string | null>(null)

	// Fonction pour jouer une musique
	const playMusic = (videoId: string, musicName: string, artistName: string) => {
		console.log('🎵 Lecture de:', { videoId, musicName, artistName })
		
		if (!videoId) {
			console.error('❌ ID vidéo manquant')
			return false
		}

		try {
			idYoutubeVideo.value = videoId
			musicNamePlaying.value = musicName || 'Titre inconnu'
			authorNamePlaying.value = artistName || 'Artiste inconnu'
			isPlayingVideo.value = true
			playerError.value = null
			
			return true
		} catch (error) {
			console.error('❌ Erreur lors de la lecture:', error)
			playerError.value = 'Erreur lors de la lecture'
			return false
		}
	}

	// Fonction pour arrêter la musique
	const stopMusic = () => {
		console.log('🎵 Arrêt de la musique')
		isPlayingVideo.value = false
		idYoutubeVideo.value = ''
		musicNamePlaying.value = 'Music Name'
		authorNamePlaying.value = 'Author Name'
		playerError.value = null
	}

	// Vérifier si une musique spécifique est en cours de lecture
	const isCurrentlyPlaying = (videoId: string) => {
		return isPlayingVideo.value && idYoutubeVideo.value === videoId
	}

	// Basculer la lecture d'une musique
	const toggleMusic = (videoId: string, musicName: string, artistName: string) => {
		if (isCurrentlyPlaying(videoId)) {
			stopMusic()
			return false
		} else {
			return playMusic(videoId, musicName, artistName)
		}
	}

	return {
		// États
		idYoutubeVideo: readonly(idYoutubeVideo),
		isPlayingVideo: readonly(isPlayingVideo),
		musicNamePlaying: readonly(musicNamePlaying),
		authorNamePlaying: readonly(authorNamePlaying),
		isPlayerLoaded: readonly(isPlayerLoaded),
		playerError: readonly(playerError),

		// Actions
		playMusic,
		stopMusic,
		toggleMusic,
		isCurrentlyPlaying,
	}
} 