<script setup>
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
			status: 'administrator',
		}
		const data = {
			createdAt: new Date().toISOString(),
			createBy: {
				id: userData.value.id,
				name: userData.value.name,
			},
			settings: {
				isPublic: false,
				isTemporary: false,
				isPlaying: false,
				isEveryoneDJ: false,
			},
			users: [],
			playlist: [],
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
		const path = 'syncradio' // Définissez le chemin de la base de données selon vos besoins
		const child = 'createBy/id'
		const value = userData.value.id

		const data = await queryData(path, child, value)

		if (data) {
			// use key as id
			for (const key in data) {
				data[key].id = key
			}
			roomList.value = data
		}
	}

	// Fonction pour filtrer les objets par l'ID utilisateur dans users
	const filterDataByUserIdInUsers = (data, userId) => {
		const result = {}
		for (const key in data) {
			if (data[key].users && Array.isArray(data[key].users)) {
				if (data[key].users.some((user) => user.id === userId)) {
					result[key] = data[key]
				}
			}
		}
		return result
	}

	// Utilisation de la fonction pour récupérer les données
	const fetchDataForUser = async () => {
		const path = 'syncradio'
		const child = 'users/id'
		const value = userData.value.id

		const data = await queryData(path, child, value)
		if (data) {
			const filteredData = filterDataByUserIdInUsers(data, userId)
			return filteredData
		} else {
			return null
		}
	}

	onMounted(async () => {
		if (userData.value) {
			getRoomCreateByUserAlreadyConnected()
			// fetchDataForUser()
			if (lastRoomYouTryToJoined.value) {
				roomIdInput.value = lastRoomYouTryToJoined.value
			}
		}
	})
</script>

<template>
	<div
		class="flex min-h-[calc(100dvh-160px)] w-full flex-col items-center justify-center gap-8 p-5 text-center sm:mx-auto"
	>
		<div class="space-y-2">
			<h2 class="text-4xl font-bold">SyncRadio Snippet</h2>
			<p>Listen together, no matter where you are</p>
		</div>
		<div class="space-y-5 sm:max-w-5xl">
			<div class="flex w-full gap-3">
				<input
					id="room-input"
					v-model="roomIdInput"
					type="text"
					placeholder="Enter Room ID"
					:disabled="!userData"
					class="bg-cb-quinary-900 placeholder-cb-tertiary-200 focus:bg-cb-tertiary-200 focus:text-cb-quinary-900 focus:placeholder-cb-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50"
				/>
				<button
					:disabled="!userData"
					class="bg-cb-primary-900 hover:bg-cb-primary-900/50 rounded px-2 py-1 font-semibold text-nowrap transition-all duration-300 ease-in-out hover:scale-110 disabled:opacity-50"
					@click="redirectToRoom()"
				>
					Join Party
				</button>
			</div>
			<button
				:disabled="!userData"
				class="bg-cb-primary-900 hover:bg-cb-primary-900/50 w-full rounded py-3 font-semibold transition-all duration-300 ease-in-out hover:scale-110 disabled:opacity-50"
				@click="createARoom"
			>
				Create My Party
			</button>
			<p v-if="!userStore.isLoginStore" class="text-sm">
				* You can create a party only if you are
				<button
					class="text-cb-primary-900 hover:text-red-500"
					@click="router.push('/authentification')"
				>
					logged in
				</button>
			</p>
		</div>
		<div class="flex w-full flex-wrap gap-3 px-20">
			<NuxtLink
				v-for="room in roomList"
				:key="room.id"
				:to="'/syncradio?id=' + room.id"
				class="bg-cb-primary-900 hover:bg-cb-primary-900/50 flex-grow rounded py-3 transition-all duration-300 ease-in-out hover:scale-110"
			>
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
