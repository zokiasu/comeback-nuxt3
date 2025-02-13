<script setup>
	import { useToast } from 'vue-toastification'
	import debounce from 'lodash.debounce'
	import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
	import { useUserStore } from '~/stores/user'

	// Initialisation des réactifs
	const searchComebackInput = ref('')
	const datas = ref([])
	const maxResults = ref(10)

	// Utilisation de Algolia Search de manière optimisée
	const { result, search } = useAlgoliaSearch('Musics')

	// Définition d'une fonction de recherche débattue
	const debouncedSearch = debounce(async (query) => {
		await useAsyncData('ssr-search-results', () => search({ query }))
		datas.value = result.value.hits
	}, 500) // Attend 500ms après le dernier appel avant d'exécuter la fonction

	watchEffect(() => {
		if (searchComebackInput.value.length > 1) {
			debouncedSearch(searchComebackInput.value)
		} else {
			datas.value = []
		}
	})

	const searchMusicComeback = computed(() => {
		return datas.value.slice(0, maxResults.value)
	})

	const { writeData, readData, updateData, deleteData, listenForUpdates } =
		useFirebaseRealtimeDatabase()
	const { getVideoFullDetails, getAllVideosFromPlaylist } = useFirebaseFunction()

	const { roomId } = defineProps({
		roomId: {
			type: String,
			required: true,
		},
	})

	const userStore = useUserStore()
	const config = useRuntimeConfig()
	const route = useRoute()
	const router = useRouter()
	const toast = useToast()
	const lastRoomYouTryToJoined = useLastRoomYouTryToJoined()

	const playerRef = ref(null)
	const messagePanel = ref(null)
	const roomPlaylistElement = ref(null)
	const recommandationCard1 = ref(null)
	const recommandationCard2 = ref(null)
	const recommandationCard3 = ref(null)

	const searchOnComeback = ref(false)
	const blurEffectLoading = ref(false)
	const errorMessage = ref(false)
	const youtubeUrlInput = ref('')
	const roomPlaylist = ref([])
	const currentUsers = ref([])
	const videoRefs = ref([])
	const isAdminRoom = ref(false)
	const isEveryoneCanAddSong = ref(false)
	const permanentRoom = ref(false)
	const actualVideoPlay = ref({
		id: null,
		title: null,
		thumbnail: null,
		duration: null,
		channelTitle: null,
		index: null,
		addedBy: {
			id: null,
			name: null,
		},
	})

	const userData = computed(() => userStore.userDataStore)
	const moderators = computed(() =>
		currentUsers.value.filter(
			(user) => user.status === 'moderator' || user.status === 'administrator',
		),
	)
	const listeners = computed(() =>
		currentUsers.value.filter((user) => user.status === 'listener'),
	)
	const isAllowedToAddSong = computed(
		() => isEveryoneCanAddSong.value || isAdminRoom.value,
	)

	function checkIfUserIsCreator(users, userId) {
		return users.some((user) => user.id === userId && user.status === 'administrator')
	}

	function checkIfUserIsAlredyInRoom(users, userId) {
		return users.some((user) => user.id === userId)
	}

	function extractYouTubeId(url) {
		const videoRegex =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/
		const playlistRegex =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/playlist\?list=|music\.youtube\.com\/playlist\?list=|youtube\.com\/watch\?.*[\&\?]list=)([\w-]+)/

		const videoMatch = url.match(videoRegex)
		const playlistMatch = url.match(playlistRegex)
		return {
			videoId: videoMatch ? videoMatch[1] : null,
			playlistId: playlistMatch ? playlistMatch[1] : null,
		}
	}

	function convertDuration(duration) {
		const match = duration.match(/PT(\d+M)?(\d+S)?/)
		const minutes = match[1] ? match[1].slice(0, -1) : '0'
		const seconds = match[2] ? match[2].slice(0, -1).padStart(2, '0') : '00'
		return `${minutes}:${seconds}`
	}

	function shareRoomUrl() {
		const url = window.location.href
		navigator.clipboard.writeText(url)
		toast.success('Room link copied to clipboard.')
	}

	function copyIdRoom() {
		navigator.clipboard.writeText(roomId)
		toast.success('Room ID copied to clipboard.')
	}

	const setVideoRef = (el, index) => {
		videoRefs.value[index] = el
	}

	const scrollToCurrentVideo = (index) => {
		if (roomPlaylistElement.value) {
			// scroll to element with isPlaying class
			const element = roomPlaylistElement.value.children[index]

			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				})
			}
		}
	}

	const updateDurationActualVideoPlay = (duration) => {
		if (isAdminRoom.value && duration > 0) {
			actualVideoPlay.value.duration = duration
			updateData('/syncradio/' + roomId + '/actualVideoPlay/', actualVideoPlay.value)
		}
	}

	const updateActualVideoPlay = (videoData) => {
		actualVideoPlay.value = videoData
		if (actualVideoPlay.value.id) {
			writeData('/syncradio/' + roomId + '/actualVideoPlay/', videoData)
		} else {
			deleteData('/syncradio/' + roomId + '/actualVideoPlay/')
		}
	}

	const updateSettings = (settingToUpdate, state) => {
		if (isAdminRoom.value) {
			const settings = {
				isEveryoneDJ:
					settingToUpdate === 'isEveryoneDJ' ? state : isEveryoneCanAddSong.value,
				isTemporary: settingToUpdate === 'isTemporary' ? state : permanentRoom.value,
			}
			updateData('/syncradio/' + roomId + '/settings/', settings)
		}
	}

	const nextVideo = () => {
		if (roomPlaylist.value) {
			const video = roomPlaylist.value[actualVideoPlay.value.index + 1]
			if (video) {
				updateActualVideoPlay(video)
				scrollToCurrentVideo(video.index)
			}
		}
	}

	const setNewVideo = (index) => {
		if (isEveryoneCanAddSong.value || isAdminRoom.value) {
			if (roomPlaylist.value) {
				const video = roomPlaylist.value[index]
				updateActualVideoPlay(video)
				nextTick(() => {
					scrollToCurrentVideo(index)
				})
			}
		} else {
			toast.error(
				'Sorry you are not allowed to play a video. Ask a admin or a moderator.',
			)
		}
	}

	const deleteVideo = (index) => {
		if (isEveryoneCanAddSong.value || isAdminRoom.value) {
			roomPlaylist.value.splice(index, 1)
			reIndexAllPlaylist()
			reIndexActualPlayingVideo()
		} else {
			toast.error(
				'Sorry you are not allowed to delete a video. Ask a admin or a moderator.',
			)
		}
	}

	const reIndexAllPlaylist = () => {
		roomPlaylist.value.forEach((video, index) => {
			video.index = index
		})
		writeData('/syncradio/' + roomId + '/playlist/', roomPlaylist.value)
	}

	const reIndexActualPlayingVideo = () => {
		actualVideoPlay.value.index =
			roomPlaylist.value?.findIndex((video) => video.id === actualVideoPlay.value.id) || 0
		writeData('/syncradio/' + roomId + '/actualVideoPlay/', actualVideoPlay.value)
	}

	const getDetailsVideoFromId = (videoId) => {
		getVideoFullDetails(videoId, config.public.YOUTUBE_API_KEY).then((data) => {
			const videoData = {
				id: data.id,
				title: data.snippet.title,
				thumbnail: data.snippet.thumbnails.default.url,
				duration: convertDuration(data.contentDetails.duration),
				channelTitle: data.snippet.channelTitle,
				addedBy: {
					id: userData.value.id,
					name: userData.value.name,
				},
			}
			if (
				isEveryoneCanAddSong.value ||
				(isAdminRoom.value && (!actualVideoPlay.value || !actualVideoPlay.value.id))
			) {
				videoData.index = 0
				updateActualVideoPlay(videoData)
				addInPlaylist(videoData)
			} else if (isEveryoneCanAddSong.value || isAdminRoom.value) {
				if (!roomPlaylist.value?.length) {
					videoData.index = 0
				} else if (roomPlaylist.value.length) {
					videoData.index = roomPlaylist.value.length
				} else {
					videoData.index = 0
				}
				addInPlaylist(videoData)
			} else {
				actualVideoPlay.value = videoData // Mise à jour pour les utilisateurs non administrateurs
			}
		})
	}

	const getYoutubeVideo = () => {
		const { videoId, playlistId } = extractYouTubeId(youtubeUrlInput.value)

		if (videoId && !playlistId) {
			getDetailsVideoFromId(videoId)
		} else if (playlistId) {
			getAllVideosFromPlaylist(playlistId, config.public.YOUTUBE_API_KEY).then((data) => {
				data.forEach(async (video) => {
					await getDetailsVideoFromId(video.snippet.resourceId.videoId)
				})
			})
		}
		youtubeUrlInput.value = ''
	}

	const addInPlaylist = (data) => {
		if (isEveryoneCanAddSong.value || isAdminRoom.value) {
			roomPlaylist.value = roomPlaylist.value || []
			roomPlaylist.value.push(data)
			writeData('/syncradio/' + roomId + '/playlist/', roomPlaylist.value)
		}
	}

	const addInPlaylistFromRecommandation = (videoId) => {
		getVideoFullDetails(videoId, config.public.YOUTUBE_API_KEY).then((data) => {
			const videoData = {
				id: data.id,
				title: data.snippet.title,
				thumbnail: data.snippet.thumbnails.default.url,
				duration: convertDuration(data.contentDetails.duration),
				channelTitle: data.snippet.channelTitle,
				addedBy: {
					id: userData.value.id,
					name: userData.value.name,
				},
			}

			if (
				(isEveryoneCanAddSong.value || isAdminRoom.value) &&
				(!actualVideoPlay.value || !actualVideoPlay.value.id)
			) {
				videoData.index = 0
				updateActualVideoPlay(videoData)
				addInPlaylist(videoData)
			} else if (isEveryoneCanAddSong.value || isAdminRoom.value) {
				if (!roomPlaylist.value) {
					videoData.index = 0
				} else {
					videoData.index = roomPlaylist.value.length
				}
				addInPlaylist(videoData)
			} else {
				actualVideoPlay.value = videoData // Mise à jour pour les utilisateurs non administrateurs
			}
		})
		searchComebackInput.value = ''
		datas.value = []
	}

	const addUserToRoom = async () => {
		const currentUser = {
			id: userData.value.id,
			name: userData.value.name,
			onlineStatus: true,
			status: 'listener',
		}
		currentUsers.value.push(currentUser)
		writeData('/syncradio/' + roomId + '/users/', currentUsers.value)
	}

	const checkUserDataUpdate = async () => {
		if (userData.value.id) {
			const data = await readData('/syncradio/' + roomId)
			const user = data.users.find((user) => user.id === userData.value.id)
			if (userData.value.name != user.name) {
				const userIndex = data.users.findIndex((user) => user.id === userData.value.id)
				user.name = userData.value.name
				writeData('/syncradio/' + roomId + '/users/' + userIndex, data.users)
			}
		}
	}

	const videoError = () => {
		toast.error('Video is restricted or unavailable. Please try another video.')
		errorMessage.value = true
	}

	const deletePlaylist = () => {
		if (isEveryoneCanAddSong.value || isAdminRoom.value) {
			roomPlaylist.value = []
			writeData('/syncradio/' + roomId + '/playlist/', roomPlaylist.value)
			reIndexActualPlayingVideo()
		} else {
			toast.error(
				'Sorry you are not allowed to delete the playlist. Ask a admin or a moderator.',
			)
		}
	}

	const isActualPlayingInYoutubeCard = (index, videoId) => {
		return actualVideoPlay?.value?.id === videoId && actualVideoPlay.value.index === index
	}

	const reloadAllRecommandationCard = () => {
		recommandationCard1.value.reloadRandomMusic()
		recommandationCard2.value.reloadRandomMusic()
		recommandationCard3.value.reloadRandomMusic()
	}

	const lastUpdateTime = () => {
		updateData('/syncradio/' + roomId, { lastUpdate: new Date().toISOString() })
	}

	const resetPlayer = () => {
		if (playerRef.value) {
			errorMessage.value = false
			playerRef.value.reloadPlayer()
		}
	}

	watch(
		() => actualVideoPlay?.value?.id,
		(newId) => {
			if (newId && playerRef.value) {
				playerRef.value.updateVideoId(newId, actualVideoPlay.value.duration)
			}
		},
	)

	onMounted(async () => {
		await userStore.checkUserAuthState()

		lastRoomYouTryToJoined.value = roomId
		const dataRouteRadio = '/syncradio/' + roomId
		const data = await readData(dataRouteRadio)
		let isCreator = false

		if (data && userData.value && roomId) {
			roomPlaylist.value = data.playlist
			currentUsers.value = data.users
			isEveryoneCanAddSong.value = data.settings.isEveryoneDJ
			permanentRoom.value = data.settings.isTemporary

			listenForUpdates(dataRouteRadio, (data) => {
				roomPlaylist.value = data.playlist
				currentUsers.value = data.users
				actualVideoPlay.value = data.actualVideoPlay
				isEveryoneCanAddSong.value = data.settings.isEveryoneDJ
				permanentRoom.value = data.settings.isTemporary
				isCreator = checkIfUserIsCreator(data.users, userData.value.id)
				if (!isCreator && actualVideoPlay.value && playerRef.value) {
					playerRef.value.seekToTimer(actualVideoPlay.value.duration)
				}
				errorMessage.value = false
			})

			if (checkIfUserIsAlredyInRoom(data.users, userData.value.id)) {
				isCreator = checkIfUserIsCreator(data.users, userData.value.id)

				checkUserDataUpdate()
				if (isCreator) {
					isAdminRoom.value = true
				}
			} else {
				addUserToRoom()
			}

			messagePanel.value.getMessages(roomId)

			nextTick(() => {
				const currentIndex = actualVideoPlay.value?.index
				if (typeof currentIndex === 'number' && roomPlaylist.value) {
					scrollToCurrentVideo(currentIndex)
				}
			})
		} else if (!data) {
			toast.error('Room not found. Please create a new room.')
			router.push('/syncradio')
		}
	})
</script>

<template>
	<main
		id="syncRadioApp"
		class="grid-cols-custom grid-rows-custom min-h-dvh-wo-nav max-h-dvh-wo-nav relative grid gap-3 px-5 pb-10 text-xs transition-all duration-300 ease-out lg:pb-0 xl:text-base 2xl:pb-5"
	>
		<section
			id="searchInputElement"
			class="space-y-2 lg:col-start-1 lg:col-end-3 lg:row-start-1"
		>
			<div class="flex justify-between space-x-2 text-sm">
				<div class="flex">
					<button
						class="rounded px-3 py-1"
						:class="
							searchOnComeback
								? 'border border-primary lg:border-none lg:bg-primary'
								: 'hover:bg-quinary'
						"
						@click="searchOnComeback = true"
					>
						<IconComeback class="h-4 w-4 lg:hidden" />
						<span class="hidden lg:block">
							Search on
							<span
								class="font-bold"
								:class="searchOnComeback ? 'text-tertiary' : 'text-primary'"
							>
								Comeback
							</span>
						</span>
					</button>
					<button
						class="rounded px-3 py-1"
						:class="
							searchOnComeback
								? 'hover:bg-quinary'
								: 'border border-primary lg:border-none lg:bg-primary'
						"
						@click="searchOnComeback = false"
					>
						<IconYoutube class="h-4 w-4 lg:hidden" />
						<span class="hidden lg:block">Add Youtube URL</span>
					</button>
				</div>

				<div class="flex gap-2">
					<button
						class="flex w-full items-center justify-center gap-1 rounded bg-quinary px-3 py-1 text-tertiary transition-all duration-300 ease-in-out hover:bg-tertiary/30 lg:w-fit lg:justify-start lg:py-1"
						@click="copyIdRoom"
					>
						<IconCopy class="h-4 w-4" />
						<span class="hidden lg:block">Copy ID</span>
					</button>
					<button
						class="flex w-full items-center justify-center gap-1 rounded bg-quinary px-3 py-1 text-tertiary transition-all duration-300 ease-in-out hover:bg-tertiary/30 lg:w-fit lg:justify-start lg:py-1"
						@click="shareRoomUrl"
					>
						<IconShare class="h-4 w-4" />
						<span class="hidden lg:block">Share Room</span>
					</button>
				</div>
			</div>

			<div v-if="searchOnComeback" class="flex gap-3">
				<div class="relative w-full">
					<input
						id="search-input"
						v-model="searchComebackInput"
						type="text"
						placeholder="Search a song"
						:disabled="!isAllowedToAddSong"
						class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none disabled:opacity-50"
					/>
					<button
						v-if="searchComebackInput.length"
						class="absolute inset-y-0 right-2.5 text-quaternary hover:text-primary"
						@click="((searchComebackInput = ''), (datas = []))"
					>
						<IconClose class="h-5 w-5" />
					</button>
				</div>
				<div
					v-if="searchMusicComeback.length"
					class="absolute inset-x-0 top-20 z-50 gap-x-5 rounded bg-quaternary py-5 drop-shadow lg:px-10"
				>
					<div class="hidden gap-3 lg:flex">
						<p>Limit Result :</p>
						<button
							:class="maxResults === 10 ? 'font-bold' : ''"
							@click="maxResults = 10"
						>
							10
						</button>
						<button
							:class="maxResults === 20 ? 'font-bold' : ''"
							@click="maxResults = 20"
						>
							20
						</button>
					</div>
					<div class="grid w-full grid-cols-1 lg:grid-cols-2">
						<div
							v-for="data in searchMusicComeback"
							:key="data.objectID"
							class="flex cursor-pointer items-center justify-between gap-3 rounded px-3 py-1.5 text-sm hover:bg-primary/10"
							@click="addInPlaylistFromRecommandation(data.objectID)"
						>
							<div class="flex items-center gap-3">
								<NuxtImg
									:src="data.mvThumbnails.default.url"
									:alt="data.name"
									class="aspect-video w-20 rounded"
								/>
								<div>
									<p>
										<span class="text-base font-semibold">{{ data.name }}</span>
										-
										{{ data.album.name }}
									</p>
									<div class="flex gap-1 text-xs">
										<p class="truncate">{{ data.artists[0].name }}</p>
										<p v-if="data.hasMv" class="rounded bg-primary px-1 font-semibold">
											MV
										</p>
									</div>
								</div>
							</div>
							<div class="rounded bg-quinary p-2">
								<IconPlus class="h-5 w-5" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<form v-else class="flex gap-3" @submit.prevent="getYoutubeVideo">
				<input
					id="search-input"
					v-model="youtubeUrlInput"
					type="text"
					placeholder="Youtube URL"
					:disabled="!isAllowedToAddSong"
					class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none disabled:opacity-50"
				/>
				<button
					type="submit"
					:disabled="!isAllowedToAddSong"
					class="overflow-hidden rounded bg-primary px-3 py-2 font-semibold uppercase text-tertiary transition-all duration-300 ease-in-out hover:bg-primary/90 disabled:opacity-50 sm:max-w-[10rem] lg:w-full"
				>
					<IconPlus class="mx-auto h-5 w-5 lg:hidden" />
					<span class="hidden lg:block">Add URL</span>
				</button>
			</form>
		</section>

		<section
			id="playerVideo"
			class="relative flex aspect-video h-full w-full flex-col items-center justify-center rounded lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:aspect-auto"
		>
			<p v-if="errorMessage" class="p-5 text-lg font-semibold">
				You are probably using your YouTube account on another page or device. Consider
				stopping it to fully enjoy SyncRadio.
			</p>
			<button
				v-if="errorMessage"
				class="rounded-lg bg-quaternary p-2 transition-all duration-300 ease-in-out hover:bg-primary"
				@click="resetPlayer"
			>
				Reload Player
			</button>
			<SyncRadioYoutubePlayer
				ref="playerRef"
				class="z-40"
				@video-ended="nextVideo"
				@video-error="videoError"
				@update-duration="updateDurationActualVideoPlay($event)"
			/>
		</section>

		<section
			id="playlist"
			class="space-y-2 overflow-hidden rounded bg-quinary p-2 text-xs lg:col-start-1 lg:col-end-2 lg:row-start-2"
		>
			<div class="flex w-full justify-between">
				<div class="flex gap-3">
					<p class="font-semibold uppercase">Playlist</p>
					<button
						v-if="isAllowedToAddSong && roomPlaylist"
						class="flex hover:text-primary"
						@click="nextVideo"
					>
						<p class="text-xs">Next Song</p>
						<IconDoubleArrowRight class="h-5 w-5 cursor-pointer" />
					</button>
				</div>
				<button v-if="isAdminRoom && roomPlaylist" @click="deletePlaylist">
					<IconDelete class="h-5 w-5 cursor-pointer hover:text-primary" />
				</button>
			</div>

			<div
				ref="roomPlaylistElement"
				class="remove-scrollbar max-h-[70%] space-y-2 overflow-hidden overflow-y-auto md:max-h-[90%] xl:max-h-[93%]"
			>
				<SyncRadioYoutubeCard
					v-for="(video, index) in roomPlaylist"
					:key="'videoPlaylist_' + index"
					:ref="setVideoRef"
					:url-picture="video.thumbnail"
					:name="video.title"
					:channel-name="video.channelTitle"
					:user-name="video.addedBy.name"
					:is-admin="isAdminRoom"
					:is-actual-playing="isActualPlayingInYoutubeCard(index, video.id)"
					:class="isActualPlayingInYoutubeCard(index, video.id) ? 'isPlaying' : ''"
					@delete-in-playlist="deleteVideo(index)"
					@play-video="setNewVideo(index)"
				/>
			</div>
		</section>

		<SyncRadioMessagePanel
			v-if="userData"
			ref="messagePanel"
			:id-room="roomId"
			:id-actual-user="userData.id"
			:name-actual-user="userData.name"
			:is-moderator="isAdminRoom"
			class="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-5 lg:col-start-3 lg:col-end-4 xl:row-end-4"
			:class="blurEffectLoading ? 'blur-sm filter' : ''"
		/>

		<section
			id="recommandation"
			class="hidden rounded bg-quinary p-3 text-xs lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:block"
		>
			<div class="flex w-full items-center justify-between">
				<p class="font-semibold uppercase">Recommandation</p>
				<button
					class="rounded bg-quaternary p-1 transition-all duration-300 ease-in-out hover:bg-primary"
					@click="reloadAllRecommandationCard"
				>
					<IconReload class="h-4 w-4" />
				</button>
			</div>
			<div class="flex h-full flex-col justify-between divide-y divide-tertiary/30 pb-5">
				<LazySyncRadioRecommandationCard
					id="recommandation-card-1"
					ref="recommandationCard1"
					:is-admin-room="isAllowedToAddSong"
					@add-in-playlist="addInPlaylistFromRecommandation"
				/>
				<LazySyncRadioRecommandationCard
					id="recommandation-card-2"
					ref="recommandationCard2"
					:is-admin-room="isAllowedToAddSong"
					@add-in-playlist="addInPlaylistFromRecommandation"
				/>
				<LazySyncRadioRecommandationCard
					id="recommandation-card-3"
					ref="recommandationCard3"
					:is-admin-room="isAllowedToAddSong"
					@add-in-playlist="addInPlaylistFromRecommandation"
				/>
			</div>
		</section>

		<section v-if="isAdminRoom" id="moderation" class="w-full">
			<div class="space-y-1">
				<p class="font-semibold">SETTINGS</p>
				<div class="lg:flex-rowtext-xs flex gap-2 md:flex-col lg:gap-5">
					<div class="space-y-1">
						<p>Who's allow to add songs?</p>
						<div class="flex gap-1">
							<button
								class="rounded px-4 py-1"
								:class="
									isEveryoneCanAddSong ? 'bg-quaternary hover:bg-primary' : 'bg-primary'
								"
								@click="updateSettings('isEveryoneDJ', false)"
							>
								Moderator
							</button>
							<button
								class="rounded px-4 py-1"
								:class="
									isEveryoneCanAddSong ? 'bg-primary' : 'bg-quaternary hover:bg-primary'
								"
								@click="updateSettings('isEveryoneDJ', true)"
							>
								Everyone
							</button>
						</div>
					</div>

					<div class="space-y-1">
						<p>Did you want to save this room and playlist?</p>
						<div class="flex gap-1">
							<button
								class="rounded px-4 py-1"
								:class="permanentRoom ? 'bg-primary' : 'bg-quaternary hover:bg-primary'"
								@click="updateSettings('isTemporary', true)"
							>
								Yes
							</button>
							<button
								class="rounded px-4 py-1"
								:class="permanentRoom ? 'bg-quaternary hover:bg-primary' : 'bg-primary'"
								@click="updateSettings('isTemporary', false)"
							>
								No
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped>
	.auto-resizing {
		field-sizing: content;
	}

	.grid-rows-custom {
		grid-template-rows: 9% 1fr 15% 1fr 10%;

		@media (min-width: 768px) {
			grid-template-rows: 9% 1fr 1fr;
		}

		@media (min-width: 1024px) {
			grid-template-rows: 9% 1fr 30%;
		}

		@media (min-width: 1920px) {
			grid-template-rows: 9% 1fr 25%;
		}
	}

	.grid-cols-custom {
		grid-template-columns: 1fr;

		@media (min-width: 768px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		@media (min-width: 1024px) {
			grid-template-columns: 25% 1fr 20%;
		}

		@media (min-width: 1440px) {
			grid-template-columns: 20% 1fr 20%;
		}
	}
</style>
