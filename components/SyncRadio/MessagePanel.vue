<script setup lang="ts">
	import { useFirebaseRealtimeDatabase } from '@/composables/useFirebaseRealtimeDatabase'
	const { idRoom, idActualUser, nameActualUser, isModerator } = defineProps<{
		idRoom: string
		idActualUser: string
		nameActualUser: string
		isModerator: boolean
	}>()

	const { writeData, readData, listenForUpdates } = useFirebaseRealtimeDatabase()

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
				name: nameActualUser,
			},
			status: 'normal',
		}

		messageList.value.push(newMessage)
		writeData('/messages/syncradio/' + idRoom + '/messageList/', messageList.value)
		message.value = ''
	}

	const getMessages = async (idRoomValue) => {
		const path = '/messages/syncradio/' + idRoomValue + '/messageList/'
		const data = await readData(path)
		if (data) {
			messageList.value = data || []
		}

		listenForUpdates(
			'/messages/syncradio/' + idRoomValue + '/messageList/',
			(data: any) => {
				messageList.value = data || []
			},
		)
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
		getMessages,
	})
</script>

<template>
	<section class="flex flex-col space-y-3">
		<div class="flex flex-grow flex-col rounded bg-quinary">
			<p class="p-3 font-semibold uppercase">Chat together</p>
			<div
				v-if="messageList.length"
				ref="messageListContent"
				class="scrollBarLight flex h-52 w-full flex-col gap-2 overflow-hidden overflow-y-auto px-2 lg:h-full"
			>
				<SyncRadioMessageCard
					v-for="message in messageList"
					:id="message.createdAt"
					:key="message.createdAt"
					:message="message.message"
					:user-name="message.user.name"
					:is-actual-user="message.user.id === idActualUser"
					:is-admin="isModerator"
				/>
			</div>
		</div>
		<div>
			<form class="flex gap-3" @submit.prevent="sendMessage">
				<input
					id="message-input"
					v-model="message"
					type="text"
					placeholder="Message"
					class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none disabled:opacity-50"
				/>
			</form>
		</div>
	</section>
</template>
