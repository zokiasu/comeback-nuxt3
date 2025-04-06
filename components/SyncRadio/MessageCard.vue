<script setup lang="ts">
	const { id, message, userName, isActualUser, isAdmin } = defineProps<{
		id: string
		message: string
		userName: string
		isActualUser: boolean
		isAdmin: boolean
	}>()
</script>

<template>
	<div
		:id="id"
		:ref="'ref_' + id"
		class="flex max-w-[80%] flex-col space-y-1"
		:class="
			isActualUser
				? 'items-end justify-end self-end'
				: 'items-start justify-start self-start'
		"
	>
		<div
			class="flex items-end gap-1"
			:class="isActualUser ? 'justify-end' : 'justify-start'"
		>
			<button v-if="isAdmin">
				<IconDelete class="hover:text-cb-primary-900 h-4 w-4 text-gray-500" />
			</button>
			<button v-if="isAdmin">
				<IconMessageBlock class="hover:text-cb-primary-900 h-4 w-4 text-gray-500" />
			</button>
			<p class="text-[10px] uppercase">{{ userName }}</p>
		</div>
		<div class="w-fit max-w-full text-sm break-words">
			<p
				class="text-breaks w-fit max-w-full rounded p-1 px-2"
				:class="isActualUser ? 'bg-cb-quaternary-950' : 'bg-cb-primary-900'"
			>
				{{ message }}
			</p>
		</div>
	</div>
</template>
