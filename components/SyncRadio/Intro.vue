<script setup>
    import { useToast } from 'vue-toastification'
    import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
    import { useUserStore } from '~/stores/user'

    const { queryData, writeDataWithRandomId } = useFirebaseRealtimeDatabase()
    const userStore = useUserStore()
    const lastRoomYouTryToJoined = useLastRoomYouTryToJoined()
    const userData = computed(() => userStore.userDataStore)
    
    const router = useRouter()
    const toast = useToast()
    const roomIdInput = ref('')
    const roomList = ref([])

    const createARoom = async () => {
        const user = {
            id: userData.value.id,
            name: userData.value.name,
            onlineStatus: true,
            status: 'administrator'
        }
        const data = { 
            createdAt: new Date().toISOString(),
            createBy: {
                id: userData.value.id,
                name: userData.value.name
            },
            settings: {
                isPublic: false,
                isTemporary: false,
                isPlaying: false,
                isEveryoneDJ: false,
            },
            users: [],
            playlist: []
        }
        data.users.push(user)
        const generatedId = await writeDataWithRandomId('/syncradio', data)
        if (generatedId) {
            router.push('/syncradio?id=' + generatedId)
        }
    }

    const redirectToRoom = () => {
        if (roomIdInput.value.trim()) {
            router.push('/syncradio?id=' + roomIdInput.value.trim())
        } else {
            toast.error('Please enter a valid Room ID')
        }
    }

    const getRoomCreateByUserAlreadyConnected = async () => {
        const path = 'syncradio'; // Définissez le chemin de la base de données selon vos besoins
        const child = 'createBy/id';
        const value = userData.value.id;

        const data = await queryData(path, child, value);

        if (data) {
            // use key as id
            for (const key in data) {
                data[key].id = key;
            }
            roomList.value = data;
        }
    }

    // Fonction pour filtrer les objets par l'ID utilisateur dans users
    const filterDataByUserIdInUsers = (data, userId) => {
        const result = {};
        for (const key in data) {
            if (data[key].users && Array.isArray(data[key].users)) {
            if (data[key].users.some(user => user.id === userId)) {
                result[key] = data[key];
            }
            }
        }
        return result;
    };

    // Utilisation de la fonction pour récupérer les données
    const fetchDataForUser = async () => {
        const path = 'syncradio';
        const child = 'users/id';
        const value = userData.value.id;
        
        const data = await queryData(path, child, value);
        if (data) {
            const filteredData = filterDataByUserIdInUsers(data, userId);
            return filteredData;
        } else {
            return null;
        }
    };

    onMounted(async () => {
        if (userData.value) {
            getRoomCreateByUserAlreadyConnected()
            // fetchDataForUser()
            if(lastRoomYouTryToJoined.value) {
                roomIdInput.value = lastRoomYouTryToJoined.value
            }
        }
    })

    useHead({
        title: 'SyncRadio - Listen to Music Together in Real-Time',
        meta: [
            {
                name: 'description',
                content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
            },
            {
                name: 'keywords',
                content: 'synchronized music, listen together, create music room, SyncRadio, collaborative playlists, online music, community experience'
            },
            {
                property: 'og:title',
                content: 'SyncRadio - Listen to Music Together in Real-Time'
            },
            {
                property: 'og:description',
                content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
            },
            {
                property: 'og:image',
                content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp' // Replace with the URL of the image to display when shared
            },
            {
                property: 'og:url',
                content: 'https://come-back.netlify.app/syncradio' // Replace with the URL of your page
            },
            {
                name: 'twitter:card',
                content: 'summary_large_image'
            },
            {
                name: 'twitter:title',
                content: 'SyncRadio - Listen to Music Together in Real-Time'
            },
            {
                name: 'twitter:description',
                content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
            },
            {
                name: 'twitter:image',
                content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp' // Replace with the URL of the image to display when shared
            },
        ],
    })

</script>

<template>
    <div class="min-h-[calc(100dvh-160px)] p-5 flex flex-col justify-center items-center text-center gap-8 w-full sm:mx-auto">
        <div class="space-y-2">
            <h2 class="font-bold text-4xl">SyncRadio Snippet</h2>
            <p>Listen together, no matter where you are</p>
        </div>
        <div class="space-y-5 sm:max-w-5xl">
            <div class="flex gap-3 w-full">
                <input
                    id="room-input"
                    v-model="roomIdInput"
                    type="text"
                    placeholder="Enter Room ID"
                    :disabled="!userData"
                    class="w-full disabled:opacity-50 rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
                <button 
                    @click="redirectToRoom()"
                    :disabled="!userData"
                    class="font-semibold disabled:opacity-50 text-nowrap bg-primary rounded px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50"
                >
                    Join Party
                </button>
            </div>
            <button @click="createARoom" :disabled="!userData" class="font-semibold disabled:opacity-50 bg-primary rounded w-full py-3 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50">
                Create My Party
            </button>
        </div>
        <div class="flex flex-wrap gap-3 w-full px-20">
            <NuxtLink v-for="room in roomList" :key="room.id" :to="'/syncradio?id=' + room.id" class="bg-primary rounded flex-grow py-3 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50">
                <p>Room :</p>
                <p>{{ room.id }}</p>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
    .auto-resizing {
        field-sizing: content;
    }
</style>