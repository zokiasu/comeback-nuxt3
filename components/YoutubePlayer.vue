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
	const isVideoDisplay = ref(false)

	let intervalId = null

	const displayVideo = () => {
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
				origin: window.location.origin,
				widget_referrer: window.location.origin,
				allow: 'autoplay; encrypted-media',
				sandbox: 'allow-same-origin allow-scripts allow-presentation',
			},
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange,
				onError: onPlayerError,
			},
		})

		// Ajouter un gestionnaire de messages pour la communication cross-origin
		window.addEventListener('message', (event) => {
			if (event.origin !== 'https://www.youtube.com') {
				return
			}
			// Traiter les messages de l'iframe YouTube ici si nécessaire
		})
	}

	const onPlayerReady = async (event) => {
		duration.value = event.target.getDuration()
		setVolume(volume.value)
	}

	const onPlayerStateChange = (event) => {
		isPlaying.value = event.data === window.YT.PlayerState.PLAYING
		if (isPlaying.value) {
			errorDetected.value = false
			duration.value = player.value?.getDuration()
		}
	}

	const onPlayerError = (event) => {
		switch (event.data) {
			case 100:
			case 101:
			case 150:
				errorDetected.value = true
				console.error('Video is restricted or unavailable.')
				break
		}
	}

	const initYTPlayer = () => {
		if (window.YT && window.YT.Player) {
			createPlayer()
		} else {
			const tag = document.createElement('script')
			tag.src = 'https://www.youtube.com/iframe_api'
			const firstScriptTag = document.getElementsByTagName('script')[0]
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
			window.onYouTubePlayerAPIReady = createPlayer
		}
	}

	const updateCurrentTime = () => {
		if (player.value && typeof player.value?.getPlayerState === 'function') {
			if (player.value?.getPlayerState() === window.YT.PlayerState.PLAYING) {
				currentTime.value = player.value?.getCurrentTime()
			}
		}
	}

	watch(
		idYoutubeVideo,
		(newId) => {
			if (player.value) {
				player.value?.loadVideoById(newId)
				if (isPlaying.value) {
					player.value?.playVideo()
				}
			}
		},
		{ immediate: true },
	)

	onMounted(() => {
		initYTPlayer()
		intervalId = setInterval(updateCurrentTime, 1000)
	})

	onBeforeUnmount(() => {
		if (intervalId) {
			clearInterval(intervalId)
		}

		if (player.value) {
			player.value?.destroy()
		}
	})

	const togglePlayPause = () => {
		if (player.value) {
			if (isPlaying.value) {
				player.value?.pauseVideo()
			} else {
				player.value?.playVideo()
			}
		}
	}

	const seek = (seconds) => {
		if (player.value) {
			const newTime = player.value?.getCurrentTime() + seconds
			player.value?.seekTo(newTime)
			currentTime.value = player.value?.getCurrentTime()
		}
	}

	const seekToTime = () => {
		if (player.value) {
			player.value?.seekTo(currentTime.value)
		}
	}

	const setVolume = (newVolume) => {
		if (player.value) {
			player.value?.setVolume(newVolume)
			volume.value = newVolume
		}
	}

	const muteVolume = () => {
		if (player.value) {
			if (volumeOn.value) {
				player.value?.mute()
				if (isPlaying.value) togglePlayPause()
			} else {
				player.value?.unMute()
				if (!isPlaying.value) togglePlayPause()
			}
			volumeOn.value = !volumeOn.value
		}
	}

	const closeYTPlayer = () => {
		isPlayingVideo.value = false
		idYoutubeVideo.value = ''

		if (player.value) {
			player.value?.destroy()
		}
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
			:allow="'autoplay; encrypted-media'"
			:sandbox="'allow-same-origin allow-scripts allow-presentation'"
		></div>
		<div class="relative flex w-full items-center justify-between bg-secondary px-5 py-3">
			<div class="flex w-full items-center space-x-2 sm:w-fit">
				<button class="hover:text-primary" @click="seek(-10)">
					<IconBackward10 class="h-7 w-7" />
				</button>
				<button v-if="isPlaying" class="hover:text-primary" @click="togglePlayPause">
					<IconPause class="h-7 w-7" />
				</button>
				<button v-else class="hover:text-primary" @click="togglePlayPause">
					<IconPlay class="h-7 w-7" />
				</button>
				<button class="hover:text-primary" @click="seek(10)">
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
				<p class="font-bold text-primary">Video is restricted or unavailable.</p>
			</div>
			<div class="hidden items-center gap-2 sm:flex">
				<!-- <button @click="displayVideo" class="p-1 bg-red-500 rounded aspect-square">
          D
        </button> -->
				<button @click="muteVolume">
					<IconVolumeOn v-if="volumeOn" class="h-7 w-7" />
					<IconVolumeOff v-else class="h-7 w-7" />
				</button>
				<input
					id="volume"
					v-model="volume"
					type="range"
					min="0"
					max="100"
					@input="setVolume(volume)"
				/>
			</div>
			<input
				id="progressTime"
				v-model="currentTime"
				type="range"
				min="0"
				:max="duration"
				class="absolute -top-1 left-0 h-1 w-full cursor-pointer overflow-hidden"
				@input="seekToTime"
			/>
			<button
				class="absolute -top-6 left-2 rounded-t-lg bg-primary px-3 py-0.5 text-xs font-semibold uppercase"
				@click="closeYTPlayer"
			>
				Close
			</button>
		</div>
	</div>
</template>
