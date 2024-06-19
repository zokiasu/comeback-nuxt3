<script setup>
    import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
    import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
    import { useUserStore } from '~/stores/user'
    import { useToast } from 'vue-toastification'

    definePageMeta({
        middleware: 'auth',
    })

    const { writeData, readData, updateData, deleteData, listenForUpdates, queryData, writeDataWithRandomId } = useFirebaseRealtimeDatabase()
    const { getVideoFullDetails } = useFirebaseFunction()

    const userStore = useUserStore()
    const userData = computed(() => userStore.userDataStore)

    const config = useRuntimeConfig()
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    const playerRef = ref(null)
    const blurEffectLoading = ref(true)
    const errorMessage = ref(false)
    const search = ref('');
    const message = ref('');
    const roomId = ref('')
    const roomPlaylist = ref([])
    const currentUsers = ref([])
    const isAdminRoom = ref(false)
    const actualVideoPlay = ref({
        id: null,
        title: null,
        thumbnail: null,
        duration: null,
        channelTitle: null,
        index: null,
        addedBy: {
            id: null,
            name: null
        }
    })

    function checkIfUserIsCreator(users, userId) {
        return users.some(user => user.id === userId && user.status === 'administrator');
    }

    function checkIfUserIsAlredyInRoom(users, userId) {
        return users.some(user => user.id === userId);
    }

    function extractYouTubeId(url) {
        const videoRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/;
        const playlistRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/playlist\?list=|music\.youtube\.com\/playlist\?list=|youtube\.com\/watch\?.*&list=)([\w-]+)/;
        
        const videoMatch = url.match(videoRegex);
        const playlistMatch = url.match(playlistRegex);
        
        return {
            videoId: videoMatch ? videoMatch[1] : null,
            playlistId: playlistMatch ? playlistMatch[1] : null
        };
    }

    function convertDuration(duration) {
        const match = duration.match(/PT(\d+M)?(\d+S)?/);
        const minutes = match[1] ? match[1].slice(0, -1) : '0';
        const seconds = match[2] ? match[2].slice(0, -1).padStart(2, '0') : '00';
        return `${minutes}:${seconds}`;
    }

    const updateDurationActualVideoPlay = (duration) => {
        if (isAdminRoom.value && duration > 0) {
            // console.log('Update duration:', duration)
            actualVideoPlay.value.duration = duration
            writeData('/syncradio/' + roomId.value + '/actualVideoPlay/', actualVideoPlay.value)
        }
    }

    const updateActualVideoPlay = (videoData) => {
        if (isAdminRoom.value) {
            actualVideoPlay.value = videoData
            console.log('Update actual video play:', videoData, playerRef.value)
            if(actualVideoPlay.value.id) {
                updateData('/syncradio/' + roomId.value + '/actualVideoPlay/', videoData)
            } else {
                deleteData('/syncradio/' + roomId.value + '/actualVideoPlay/')
            }
        }
    }

    const nextVideo = () => {
        console.log('Next video')
        if(isAdminRoom.value) {
            const video = roomPlaylist.value[actualVideoPlay.value.index + 1]
            if(video) {
                updateActualVideoPlay(video)
            }
        }
    }

    const setNewVideo = (index) => {
        console.log('setNewVideo')
        if(isAdminRoom.value) {
            if(roomPlaylist.value) {
                // récupérer la vidéo la plus haute dans la playlist
                const video = roomPlaylist.value[index]
                console.log('setNewVideo:', video)
                // mettre à jour la vidéo actuelle
                updateActualVideoPlay(video)
                // deleteVideo(index)
            }
        } else {
            toast.error('Sorry you are not allowed to play a video. Ask a admin or a moderator.')
        }
    }

    const deleteVideo = (index) => {
        console.log('Delete video:', index)
        if(isAdminRoom.value) {
            roomPlaylist.value.splice(index, 1)
            writeData('/syncradio/' + roomId.value + '/playlist/', roomPlaylist.value)
        } else {
            toast.error('Sorry you are not allowed to delete a video. Ask a admin or a moderator.')
        }
    }

    const getYoutubeVideo = () => {
        const { videoId, playlistId } = extractYouTubeId(search.value);
        
        if (playlistId) {
            console.log('Playlist ID:', playlistId);
        } else if (videoId) {
            getVideoFullDetails(videoId, config.public.YOUTUBE_API_KEY).then((data) => {
                const videoData = {
                    id: data.id,
                    title: data.snippet.title,
                    thumbnail: data.snippet.thumbnails.default.url,
                    duration: convertDuration(data.contentDetails.duration),
                    channelTitle: data.snippet.channelTitle,
                    addedBy: {
                        id: userData.value.id,
                        name: userData.value.name
                    }
                }
                console.log('actualVideoPlay.value.id', actualVideoPlay.value)
                if(isAdminRoom.value && (!actualVideoPlay.value || !actualVideoPlay.value.id)) {
                    // actualVideoPlay.value = videoData
                    videoData.index = 0
                    updateActualVideoPlay(videoData)
                    addInPlayslit(videoData)
                } else if (isAdminRoom.value) {
                    videoData.index = roomPlaylist.value.length
                    addInPlayslit(videoData)
                } else {
                    actualVideoPlay.value = videoData; // Mise à jour pour les utilisateurs non administrateurs
                }
            })
            search.value = ''; 
        } else {
            console.log('No valid YouTube ID found.');
        }
    }

    const addInPlayslit = (data) => {
        if(isAdminRoom.value) {
            roomPlaylist.value = roomPlaylist.value || []
            roomPlaylist.value.push(data)
            writeData('/syncradio/' + roomId.value + '/playlist/', roomPlaylist.value)
        }
    }

    const addUserToRoom = async () => {
        const currentUser = {
            id: userData.value.id,
            name: userData.value.name,
            onlineStatus: true,
            status: 'listener'
        }
        currentUsers.value.push(currentUser)
        console.log('users:', currentUsers.value)
        writeData('/syncradio/' + roomId.value + '/users/', currentUsers.value)
    }

    const videoError = () => {
        console.log('Video error')
        updateActualVideoPlay({
            id: null,
            title: null,
            thumbnail: null,
            duration: null,
            channelTitle: null,
            index: null,
            addedBy: {
                id: null,
                name: null
            }
        })
        toast.error('Video is restricted or unavailable. Please try another video.');
        errorMessage.value = true
    }

    const deletePlaylist = () => {
        if(isAdminRoom.value) {
            roomPlaylist.value = []
            writeData('/syncradio/' + roomId.value + '/playlist/', roomPlaylist.value)
        } else {
            toast.error('Sorry you are not allowed to delete the playlist. Ask a admin or a moderator.')
        }
    }

    const isActualPlayingInYoutubeCard = (index, videoId) => {
        return actualVideoPlay.value.id === videoId && actualVideoPlay.value.index === index
    }

    watch(() => actualVideoPlay?.value?.id, (newId) => {
        console.log('New actualVideoPlay.id:', newId);
        if (newId && playerRef.value) {
            playerRef.value.updateVideoId(newId, actualVideoPlay.value.duration);
        }
    });

    onMounted(async () => {
        console.log('AsyncRadio/id')
        roomId.value = route.params.id
        const dataRouteRadio = '/syncradio/' + roomId.value
        const data = await readData(dataRouteRadio)
        let isCreator = false
        console.log('Data:', data, 'UserData:', userData.value)

        if (data && userData.value.id) {
            blurEffectLoading.value = false
            roomPlaylist.value = data.playlist
            currentUsers.value = data.users

            listenForUpdates(dataRouteRadio, (data) => {
                roomPlaylist.value = data.playlist
                currentUsers.value = data.users
                actualVideoPlay.value = data.actualVideoPlay
                isCreator = checkIfUserIsCreator(data.users, userData.value.id);
                if (!isCreator) {
                    playerRef.value.seekToTimer(actualVideoPlay.value.duration);
                }
                errorMessage.value = false
            })

            if(checkIfUserIsAlredyInRoom(data.users, userData.value.id)) {
                console.log('User is in room')
                isCreator = checkIfUserIsCreator(data.users, userData.value.id);

                if (isCreator) {
                    console.log('User is creator')
                    isAdminRoom.value = true
                } else {
                    console.log('User is not creator')
                }
            } else {
                console.log('User is not in room')
                addUserToRoom()
            }
        } else if(!userData) {
            toast.error('You are not connected. Please connect to access the room.')
            router.push('/')
        } else {
            toast.error('Room not found. Please create a new room.')
            router.push('/syncradio')
        }
    })

    useHead({
        title: 'SyncRadio - Room',
        meta: [
            {
                name: 'description',
                content: 'Share a YouTube playlist with your friends in real-time'
            },
        ],
    })

const readDataExample = async () => {
    const data = await readData('/syncradio/rooms')
    console.log(data)
}

const updateDataExample = () => {
    updateData('/syncradio/rooms', { key: 'newValue' })
}

const deleteDataExample = () => {
    deleteData('/syncradio/rooms')
}

const writeDataWithRandomIdExample = async () => {
    const data = { key: 'value', otherKey: 'otherValue' }
    const generatedId = await writeDataWithRandomId('/example/path', data)
    if (generatedId) {
        console.log('Data written with ID:', generatedId)
    }
}

const listenForUpdatesExample = () => {
    listenForUpdates('/syncradio/rooms', (data) => {
        console.log('Data updated:', data)
    })
}

const writeDataExample = () => {
    writeData('/syncradio/rooms', { key: 'value' })
}
</script>

<template>
    <div class="relative flex flex-col md:flex-row px-8 pb-8 gap-3 min-h-[calc(100dvh-100px)] transition-all ease-out duration-300">
        <section class="space-y-3 w-full flex flex-col":class="blurEffectLoading ? 'filter blur-sm' : ''">
            <form
                @submit.prevent="getYoutubeVideo"
                class="flex flex-col sm:flex-row gap-3"
            >
                <input
                    id="search-input"
                    v-model="search"
                    type="text"
                    placeholder="Youtube URL"
                    :disabled="!isAdminRoom"
                    class="w-full disabled:opacity-50 rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
                <button
                    type="submit"
                    :disabled="!isAdminRoom"
                    class="w-full disabled:opacity-50 sm:max-w-[10rem] overflow-hidden bg-primary rounded py-2 text-tertiary font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-primary/90"
                >
                    Add URL
                </button>
            </form>
            <div id="playlist-video" class="flex flex-col-reverse justify-end lg:justify-start lg:flex-row gap-3 flex-grow">
                <div class="bg-quinary rounded p-3 space-y-2 text-xs lg:w-[25%] lg:max-w-[25%] lg:min-w-[25%]">
                    <div class="w-full flex justify-between">
                        <p class="uppercase font-semibold">Playlist</p>
                        <button v-if='isAdminRoom' @click="deletePlaylist">
                            <IconDelete class="w-5 h-5 cursor-pointer hover:text-primary" />
                        </button>
                    </div>
                    <div class="flex flex-col gap-2 w-full h-full max-h-[10dvh] lg:max-h-[58dvh] overflow-hidden overflow-y-auto remove-scrollbar">
                        <SyncRadioYoutubeCard
                            v-for="(video, index) in roomPlaylist"
                            :key="'videoPlaylist_'+index"
                            :urlPicture="video.thumbnail"
                            :name="video.title"
                            :channelName="video.channelTitle"
                            :userName="video.addedBy.name"
                            :isAdmin="isAdminRoom"
                            :isActualPlaying="isActualPlayingInYoutubeCard(index, video.id)"
                            @deleteInPlaylist="deleteVideo(index)"
                            @playVideo="setNewVideo(index)"
                        />
                    </div>
                </div>
                <div class="bg-primary relative h-full w-full aspect-video lg:aspect-auto rounded max-h-[768px]">
                    <p v-if="errorMessage" class="font-semibold p-5 text-lg">You are probably using your YouTube account on another page or device. Consider stopping it to fully enjoy SyncRadio.</p>
                    <!-- <p v-else class="absolute inset-0 p-5 max-w-xl mx-auto font-semibold text-center text-lg mt-[20%]">Add a YouTube URL and share the room link with your friends to enjoy a collaboratively designed or individual playlist in real-time together</p> -->
                    <SyncRadioYoutubePlayer
                        ref="playerRef"
                        @videoEnded="nextVideo"
                        @videoError="videoError"
                        @updateDuration="updateDurationActualVideoPlay($event)"
                        class="z-50" 
                    />
                </div>
            </div>
            <div class="lg:flex gap-3 hidden">
                <div class="bg-quinary rounded p-3 space-y-2 text-xs w-[25%] max-w-[25%] min-w-[25%]">
                    <p class="uppercase font-semibold">Recommandation</p>
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 rounded w-full p-2 bg-quaternary">
                            <p>Hello World</p>
                            <p>Hello World</p>
                        </div>
                        <div class="flex gap-2 rounded w-full p-2 bg-quaternary">
                            <p>Hello World</p>
                            <p>Hello World</p>
                        </div>
                        <div class="flex gap-2 rounded w-full p-2 bg-quaternary">
                            <p>Hello World</p>
                            <p>Hello World</p>
                        </div>
                    </div>
                </div>
                <div class="w-full bg-quinary rounded p-3">
                    <p>Hello World</p>
                </div>
            </div>
        </section>
        <section class="space-y-3 lg:w-[30%] flex flex-col flex-grow":class="blurEffectLoading ? 'filter blur-sm' : ''">
            <div class="bg-quinary flex-grow rounded p-3 opacity-50">
                <p class="uppercase font-semibold">Chat together</p>
            </div>
            <form
                @submit.prevent="getYoutubeVideo"
                class="flex flex-col sm:flex-row gap-3"
            >
                <input
                    id="search-input"
                    v-model="message"
                    type="text"
                    placeholder="Message"
                    disabled
                    class="w-full rounded border-none bg-quinary px-5 py-2 disabled:opacity-50 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
                <button
                    type="submit"
                    disabled
                    class="lg:w-fit px-3 bg-primary rounded disabled:opacity-50 py-2 text-tertiary font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-secondary"
                >
                    Send
                </button>
            </form>
        </section>
        <div class="absolute inset-0 z-50 items-center justify-center" :class="blurEffectLoading ? 'flex' : 'hidden'">
            <p class="font-bold text-xl lg:text-3xl bg-quaternary/50 p-10 rounded-lg">Please wait some verification is loaded...</p>
        </div>
    </div>
</template>

<style scoped>
    .auto-resizing {
        field-sizing: content;
    }
</style>