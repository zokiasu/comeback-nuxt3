<template>
    <ComingSoon />
    <!-- <div class="min-h-[calc(100dvh-160px)] p-5 flex flex-col justify-center items-center text-center gap-8 lg:max-w-xl lg:mx-auto">
        <div class="space-y-2">
            <h2 class="font-bold text-4xl">SyncRadio Snippet</h2>
            <p>Listen together, no matter where you are</p>
        </div>
        <div class="space-y-5 w-full">
            <div class="flex gap-3 w-full">
                <input
                    id="room-input"
                    v-model="roomIdInput"
                    type="text"
                    placeholder="Enter Room ID"
                    class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
                <button 
                    @click="redirectToRoom()" 
                    class="font-semibold text-nowrap bg-primary rounded px-2 py-1 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50"
                >
                    Join Party
                </button>
            </div>
            <button @click="createARoom" class="font-semibold bg-primary rounded w-full py-3 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50">
                Create My Party
            </button>
        </div>
    </div> -->
</template>

<script setup>
    import { useToast } from 'vue-toastification'
    import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
    import { useUserStore } from '~/stores/user'

    const { writeDataWithRandomId } = useFirebaseRealtimeDatabase()
    const { userDataStore } = useUserStore()
    console.log('userDataStore:', userDataStore)
    const router = useRouter()
    const toast = useToast()
    const roomIdInput = ref('')

    const createARoom = async () => {
        const data = { 
            createdAt: new Date().toISOString(),
            temporary: true,
            users: [],
            playlist: []
        }
        const user = {
            id: '1',
            name: 'John Doe'
        }
        const generatedId = await writeDataWithRandomId('/syncradio', data)
        if (generatedId) {
            console.log('Data written with ID:', generatedId)
            router.push('/syncradio/' + generatedId)
        }
    }

    const redirectToRoom = () => {
        if (roomIdInput.value.trim()) {
            router.push('/syncradio/' + roomIdInput.value.trim())
        } else {
            toast.error('Please enter a valid Room ID')
        }
    }
</script>

<style scoped>
    .auto-resizing {
        field-sizing: content;
    }
</style>