<script setup lang="ts">
    import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
    const { idRoom, idActualUser, nameActualUser, isModerator } = defineProps<{
        idRoom: string;
        idActualUser: string;
        nameActualUser: string;
        isModerator: boolean;
    }>();

    const { queryData, writeData, readData, updateData, deleteData, listenForUpdates } = useFirebaseRealtimeDatabase()

    const message = ref('')
    const messageList = ref<any[]>([])
    const messageListContent = ref<HTMLElement | null>(null)

    const sendMessage = () => {
        console.log('sendMessage', message.value)
        console.log('sendMessage idRoom', idRoom)
        if (message.value.trim() === '') return

        const newMessage = {
            createdAt: new Date().toISOString(),
            message: message.value,
            user: {
                id: idActualUser,
                name: nameActualUser
            },
            status: 'normal'
        }
        
        messageList.value.push(newMessage)
        writeData('/messages/syncradio/' + idRoom + '/messageList/', messageList.value)
        message.value = ''
    }

    const getMessages = async (idRoomValue) => {
        console.log('getMessages')
        const path = '/messages/syncradio/' + idRoomValue + '/messageList/'
        const data = await readData(path)
        console.log('getMessages data', data, idRoomValue)
        if (data) {
            messageList.value = (data ? data : [])
            console.log('Message Panel messageList', messageList.value)
        }

        listenForUpdates('/messages/syncradio/' + idRoomValue + '/messageList/', (data: any) => {
            messageList.value = data ? data : []
        })
    }

    const scrollToBottom = () => {
        if (messageListContent.value) {
            messageListContent.value.scrollTop = messageListContent.value.scrollHeight
        }
    }

    watch(messageList, () => {
        nextTick(() => {
            scrollToBottom()
        })
    })

    defineExpose({
        getMessages
    })
</script>

<template>
    <section class="space-y-3 lg:w-[23%] lg:max-w-[23%] flex flex-col flex-grow">
        <div class="bg-quinary lg:flex-grow rounded pb-4 h-[15%] lg:h-[90%] flex flex-col">
            <p class="uppercase font-semibold p-3">Chat together</p>
            <div ref="messageListContent" v-if="messageList.length" class="flex flex-col gap-2 px-2 w-full h-52 lg:h-full overflow-hidden overflow-y-auto scrollBarLight">
                <SyncRadioMessageCard
                    v-for="message in messageList"
                    :key="message.createdAt"
                    :id="message.createdAt"
                    :message="message.message"
                    :userName="message.user.name"
                    :isActualUser="message.user.id === idActualUser"
                    :isAdmin="isModerator"
                />
            </div>
        </div>
        <form
            @submit.prevent="sendMessage"
            class="flex gap-3"
        >
            <input
                id="message-input"
                v-model="message"
                type="text"
                placeholder="Message"
                class="w-full rounded border-none bg-quinary px-5 py-2 disabled:opacity-50 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
            />
        </form>
    </section>
</template>