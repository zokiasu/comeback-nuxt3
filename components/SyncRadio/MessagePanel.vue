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
        const path = '/messages/syncradio/' + idRoomValue + '/messageList/'
        const data = await readData(path)
        if (data) {
            messageList.value = (data ? data : [])
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
    <section class="flex flex-col space-y-3">
        <div class="flex flex-col flex-grow rounded bg-quinary">
            <p class="p-3 font-semibold uppercase">Chat together</p>
            <div ref="messageListContent" v-if="messageList.length" class="flex flex-col w-full gap-2 px-2 overflow-hidden overflow-y-auto h-52 lg:h-full scrollBarLight">
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
        <div>
            <form
                @submit.prevent="sendMessage"
                class="flex gap-3"
            >
                <input
                    id="message-input"
                    v-model="message"
                    type="text"
                    placeholder="Message"
                    class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded bg-quinary disabled:opacity-50 placeholder-tertiary drop-shadow-xl focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                />
            </form>
        </div>
    </section>
</template>