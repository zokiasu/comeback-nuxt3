<script setup>
	const idYoutubeVideo = useIdYoutubeVideo()
	const isPlayingVideo = useIsPlayingVideo()
	const musicNamePlaying = useMusicNamePlaying()
	const authorNamePlaying = useAuthorNamePlaying()

	const isPlaying = ref(false)
	const currentTime = ref(0)
	const duration = ref(0)
	const globalPlayerContainer = ref(null)
	const player = ref(null)
	const volumeOn = ref(true)
	const volume = ref(20)
	const errorDetected = ref(false)
	const errorMessage = ref('')
	const isVideoDisplay = ref(false)
	const isPlayerReady = ref(false)

	let intervalId = null

	const displayVideo = () => {
		if (!import.meta.client) return

		const iframe = document.getElementById('globalPlayerContainer')
		if (iframe) {
			if (isVideoDisplay.value) {
				iframe.classList.remove('hidden')
				isVideoDisplay.value = false
			} else {
				iframe.classList.add('hidden')
				isVideoDisplay.value = true
			}
		}
	}

	// Création du lecteur YouTube
	const createPlayer = () => {
		if (!import.meta.client) return

		console.log('🎵 Création du lecteur YouTube avec vidéo:', idYoutubeVideo.value)

		try {
			player.value = new window.YT.Player('globalPlayerContainer', {
				videoId: idYoutubeVideo.value,
				height: '100%',
				width: '100%',
				playerVars: {
					autoplay: 1,
					controls: 0,
					disablekb: 1,
					enablejsapi: 1,
					fs: 0,
					iv_load_policy: 3,
					modestbranding: 1,
					playsinline: 1,
					rel: 0,
					showinfo: 0,
					origin: window.location.protocol + '//' + window.location.host,
					widget_referrer: window.location.protocol + '//' + window.location.host,
					host: 'https://www.youtube-nocookie.com',
				},
				events: {
					onReady: onPlayerReady,
					onStateChange: onPlayerStateChange,
					onError: onPlayerError,
				},
			})
		} catch (error) {
			console.error('❌ Erreur lors de la création du lecteur YouTube:', error)
			errorDetected.value = true
			errorMessage.value = 'Erreur lors du chargement du lecteur'
		}
	}

	const onPlayerReady = async (event) => {
		console.log('✅ Lecteur YouTube prêt')
		isPlayerReady.value = true
		duration.value = event.target.getDuration()
		setVolume(volume.value)
		errorDetected.value = false
		errorMessage.value = ''
	}

	const onPlayerStateChange = (event) => {
		if (!import.meta.client) return

		isPlaying.value = event.data === window.YT.PlayerState.PLAYING
		if (isPlaying.value) {
			errorDetected.value = false
			errorMessage.value = ''
			duration.value = player.value?.getDuration()
		}

		// Log des changements d'état pour debug
		const states = {
			[-1]: 'non démarré',
			[0]: 'terminé',
			[1]: 'lecture',
			[2]: 'pause',
			[3]: 'mise en mémoire tampon',
			[5]: "vidéo mise en file d'attente",
		}
		console.log('🎵 État du lecteur:', states[event.data] || event.data)
	}

	const onPlayerError = (event) => {
		console.error('❌ Erreur du lecteur YouTube:', event.data)
		errorDetected.value = true

		switch (event.data) {
			case 2:
				errorMessage.value = 'ID de vidéo invalide'
				break
			case 5:
				errorMessage.value = 'Erreur de lecture HTML5'
				break
			case 100:
				errorMessage.value = 'Vidéo introuvable ou supprimée'
				break
			case 101:
			case 150:
				errorMessage.value = 'Vidéo restreinte ou non disponible dans votre région'
				break
			default:
				errorMessage.value =
					'Erreur de lecture YouTube. Essayez de désactiver votre bloqueur de publicités.'
		}
	}

	// Intercepter les erreurs de postMessage
	if (import.meta.client) {
		// Filtrer les erreurs postMessage YouTube au niveau global
		window.addEventListener('error', (event) => {
			if (
				event.error &&
				event.error.message &&
				event.error.message.includes('postMessage') &&
				event.error.message.includes('youtube.com')
			) {
				console.log('🎵 Info: Communication YouTube iframe (normal en développement)')
				event.preventDefault()
				return false
			}
		})

		// Filtrer aussi les erreurs de console
		const originalConsoleError = console.error
		console.error = (...args) => {
			const message = args.join(' ')
			// Filtrer les erreurs postMessage YouTube connues (non critiques)
			if (message.includes('postMessage') && message.includes('youtube.com')) {
				console.log('🎵 Info: Communication YouTube iframe (normal en localhost)')
				return
			}
			originalConsoleError.apply(console, args)
		}
	}

	const initYTPlayer = () => {
		if (!import.meta.client) return

		console.log('🎵 Initialisation du lecteur YouTube...')

		// Vérifier si YouTube est bloqué
		if (
			window.navigator &&
			window.navigator.userAgent &&
			(window.navigator.userAgent.includes('uBlock') ||
				window.navigator.userAgent.includes('AdBlock'))
		) {
			console.warn('⚠️ Bloqueur de publicités détecté')
			errorDetected.value = true
			errorMessage.value =
				'Bloqueur de publicités détecté - le lecteur peut ne pas fonctionner'
		}

		if (window.YT && window.YT.Player) {
			console.log('✅ API YouTube déjà chargée')
			createPlayer()
		} else {
			console.log("📥 Chargement de l'API YouTube...")

			// Vérifier si le script est déjà présent
			const existingScript = document.querySelector(
				'script[src*="youtube.com/iframe_api"]',
			)
			if (existingScript) {
				console.log('⏳ Script YouTube déjà en cours de chargement...')
				return
			}

			const tag = document.createElement('script')
			tag.src = 'https://www.youtube.com/iframe_api'
			tag.onload = () => {
				console.log('✅ Script YouTube chargé')
			}
			tag.onerror = (error) => {
				console.error("❌ Erreur lors du chargement de l'API YouTube:", error)
				errorDetected.value = true
				errorMessage.value =
					'Impossible de charger YouTube. Vérifiez votre bloqueur de publicités.'
			}

			const firstScriptTag = document.getElementsByTagName('script')[0]
			if (firstScriptTag && firstScriptTag.parentNode) {
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
			} else {
				document.head.appendChild(tag)
			}

			// Callback global pour l'API YouTube avec timeout
			window.onYouTubePlayerAPIReady = () => {
				console.log('✅ API YouTube prête')
				createPlayer()
			}

			// Timeout de sécurité
			setTimeout(() => {
				if (!window.YT || !window.YT.Player) {
					console.error('❌ Timeout: API YouTube non chargée après 10 secondes')
					errorDetected.value = true
					errorMessage.value = 'Timeout YouTube. Bloqueur de publicités actif ?'
				}
			}, 10000)
		}
	}

	const updateCurrentTime = () => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			if (player.value?.getPlayerState() === window.YT.PlayerState.PLAYING) {
				currentTime.value = player.value?.getCurrentTime()
			}
		} catch (error) {
			console.warn('⚠️ Erreur lors de la mise à jour du temps:', error)
		}
	}

	watch(
		idYoutubeVideo,
		(newId) => {
			if (player.value && isPlayerReady.value && newId) {
				console.log('🔄 Changement de vidéo:', newId)
				try {
					player.value?.loadVideoById(newId)
					if (isPlaying.value) {
						player.value?.playVideo()
					}
				} catch (error) {
					console.error('❌ Erreur lors du changement de vidéo:', error)
					errorDetected.value = true
					errorMessage.value = 'Erreur lors du changement de vidéo'
				}
			}
		},
		{ immediate: true },
	)

	onMounted(() => {
		console.log('🎵 Montage du composant YoutubePlayer')
		initYTPlayer()
		intervalId = setInterval(updateCurrentTime, 1000)
	})

	onBeforeUnmount(() => {
		console.log('🎵 Démontage du composant YoutubePlayer')

		if (intervalId) {
			clearInterval(intervalId)
		}

		if (player.value) {
			try {
				player.value?.destroy()
			} catch (error) {
				console.warn('⚠️ Erreur lors de la destruction du lecteur:', error)
			}
		}
	})

	const togglePlayPause = () => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			if (isPlaying.value) {
				player.value?.pauseVideo()
			} else {
				player.value?.playVideo()
			}
		} catch (error) {
			console.error('❌ Erreur lors du toggle play/pause:', error)
		}
	}

	const seek = (seconds) => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			const newTime = player.value?.getCurrentTime() + seconds
			player.value?.seekTo(newTime)
			currentTime.value = player.value?.getCurrentTime()
		} catch (error) {
			console.error('❌ Erreur lors du seek:', error)
		}
	}

	const seekToTime = () => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			player.value?.seekTo(currentTime.value)
		} catch (error) {
			console.error('❌ Erreur lors du seekTo:', error)
		}
	}

	const setVolume = (newVolume) => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			player.value?.setVolume(newVolume)
			volume.value = newVolume
		} catch (error) {
			console.error('❌ Erreur lors du réglage du volume:', error)
		}
	}

	const muteVolume = () => {
		if (!import.meta.client || !player.value || !isPlayerReady.value) return

		try {
			if (volumeOn.value) {
				player.value?.mute()
				if (isPlaying.value) togglePlayPause()
			} else {
				player.value?.unMute()
				if (!isPlaying.value) togglePlayPause()
			}
			volumeOn.value = !volumeOn.value
		} catch (error) {
			console.error('❌ Erreur lors du mute/unmute:', error)
		}
	}

	const closeYTPlayer = () => {
		console.log('🎵 Fermeture du lecteur YouTube')
		isPlayingVideo.value = false
		idYoutubeVideo.value = ''

		if (player.value) {
			try {
				player.value?.destroy()
			} catch (error) {
				console.warn('⚠️ Erreur lors de la fermeture:', error)
			}
		}

		// Reset des états
		isPlayerReady.value = false
		errorDetected.value = false
		errorMessage.value = ''
		isPlaying.value = false
		currentTime.value = 0
		duration.value = 0
	}

	const convertDuration = (duration) => {
		const minutes = Math.floor(duration / 60)
		let seconds = Math.round(duration % 60)

		seconds = seconds < 10 ? `0${seconds}` : seconds

		return `${minutes}:${seconds}`
	}
</script>

<template>
	<div
		class="fixed bottom-0 z-[1100] flex w-full flex-col items-center justify-center space-y-3 sm:items-end sm:justify-end"
	>
		<div
			id="globalPlayerContainer"
			ref="globalPlayerContainer"
			class="hidden aspect-video w-1/4 min-w-[20rem] overflow-hidden rounded-lg px-2 lg:absolute lg:-top-72 lg:right-0 lg:z-50 lg:h-72"
		></div>
		<div
			class="bg-cb-secondary-950 relative flex w-full items-center justify-between px-5 py-3"
		>
			<div class="flex w-full items-center space-x-2 sm:w-fit">
				<button
					class="hover:text-cb-primary-900 disabled:opacity-50"
					:disabled="!isPlayerReady"
					@click="seek(-10)"
				>
					<IconBackward10 class="h-7 w-7" />
				</button>
				<button
					v-if="isPlaying"
					class="hover:text-cb-primary-900 disabled:opacity-50"
					:disabled="!isPlayerReady"
					@click="togglePlayPause"
				>
					<IconPause class="h-7 w-7" />
				</button>
				<button
					v-else
					class="hover:text-cb-primary-900 disabled:opacity-50"
					:disabled="!isPlayerReady"
					@click="togglePlayPause"
				>
					<IconPlay class="h-7 w-7" />
				</button>
				<button
					class="hover:text-cb-primary-900 disabled:opacity-50"
					:disabled="!isPlayerReady"
					@click="seek(10)"
				>
					<IconForward10 class="h-7 w-7" />
				</button>
				<div class="hidden items-center gap-1 pl-5 text-xs md:flex">
					<p>{{ convertDuration(currentTime) }}</p>
					<p>/</p>
					<p>{{ convertDuration(duration) }}</p>
				</div>
			</div>
			<div v-if="!errorDetected" class="w-full sm:w-fit xl:flex xl:items-center xl:gap-1">
				<p class="font-semibold">{{ authorNamePlaying }}</p>
				<p class="text-xs">{{ musicNamePlaying }}</p>
			</div>
			<div v-else class="w-full sm:w-fit">
				<p class="text-cb-primary-900 font-bold">{{ errorMessage }}</p>
			</div>
			<div class="hidden items-center gap-2 sm:flex">
				<!-- <button @click="displayVideo" class="p-1 bg-red-500 rounded aspect-square">
          D
        </button> -->
				<button
					:disabled="!isPlayerReady"
					class="disabled:opacity-50"
					@click="muteVolume"
				>
					<IconVolumeOn v-if="volumeOn" class="h-7 w-7" />
					<IconVolumeOff v-else class="h-7 w-7" />
				</button>
				<input
					id="volume"
					v-model="volume"
					type="range"
					min="0"
					max="100"
					:disabled="!isPlayerReady"
					class="disabled:opacity-50"
					@input="setVolume(volume)"
				/>
			</div>
			<input
				id="progressTime"
				v-model="currentTime"
				type="range"
				min="0"
				:max="duration"
				:disabled="!isPlayerReady"
				class="absolute -top-1 left-0 h-1 w-full cursor-pointer overflow-hidden disabled:opacity-50"
				@input="seekToTime"
			/>
			<button
				class="bg-cb-primary-900 absolute -top-6 left-2 cursor-pointer rounded-t-lg px-3 py-0.5 text-xs font-semibold uppercase"
				@click="closeYTPlayer"
			>
				Close
			</button>
		</div>
	</div>
</template>
