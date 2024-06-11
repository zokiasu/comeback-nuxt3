<template>
    <div>
        <div class="grid grid-cols-1 gap-3 p-5">
            <div class="space-y-3">
                <input
                    id="search-input"
                    v-model="search"
                    type="text"
                    placeholder="Search"
                    class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
                <div class="flex flex-col-reverse lg:flex-row gap-3">
                    <div class="bg-quinary rounded p-3 space-y-2 text-xs">
                        <p class="uppercase font-semibold">Chat together</p>
                        <div class="grid grid-cols-1 gap-2 w-full h-full">
                            <SyncRadioYoutubeCard />
                        </div>
                    </div>
                    <div class="bg-primary h-20 space-x-5">
                        <button @click="writeDataExample">Write Data</button>
                        <button @click="readDataExample">Read Data</button>
                        <button @click="updateDataExample">Update Data</button>
                        <button @click="deleteDataExample">Delete Data</button>
                        <button @click="writeDataWithRandomIdExample">Write Data with Random ID</button>
                    </div>
                </div>
            </div>
            <!-- REALTIME CHAT
            <div class="space-y-2">
                <div class="bg-quinary rounded p-3 space-y-2 text-xs">
                    <p class="uppercase font-semibold">Chat together</p>
                    <div class="flex flex-col w-full h-full">
                        <SyncRadioMessageCard 
                            id="1" 
                            message="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            :isActualUser="false"
                            :isAdmin="true"
                        />
                        <SyncRadioMessageCard 
                            id="2" 
                            message="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            :isActualUser="true"
                            :isAdmin="true"
                        />
                        <SyncRadioMessageCard 
                            id="3" 
                            message="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                            :isActualUser="false"
                            :isAdmin="true"
                        />
                    </div>
                </div>
                <textarea
                    id="message-input"
                    v-model="message"
                    type="text"
                    placeholder="Send your message..."
                    class="w-full auto-resizing rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
            </div> -->
        </div>
    </div>
</template>

<script setup>
    import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
    import { useToast } from 'vue-toastification'

    const { writeData, readData, updateData, deleteData, listenForUpdates, queryData, writeDataWithRandomId } = useFirebaseRealtimeDatabase()
    const router = useRouter()
    const toast = useToast()

    const search = ref('');
    const message = ref('');
    const roomId = ref(null)

    const writeDataExample = () => {
        writeData('/syncradio/rooms', { key: 'value' })
    }

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
</script>

<style scoped>
    .auto-resizing {
        field-sizing: content;
    }
</style>