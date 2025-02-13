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
				<IconDelete class="h-4 w-4 text-gray-500 hover:text-primary" />
			</button>
			<button v-if="isAdmin">
				<IconMessageBlock class="h-4 w-4 text-gray-500 hover:text-primary" />
			</button>
			<p class="text-[10px] uppercase">{{ userName }}</p>
		</div>
		<div class="w-fit max-w-full break-words text-sm">
			<p
				class="text-breaks w-fit max-w-full rounded p-1 px-2"
				:class="isActualUser ? 'bg-quaternary' : 'bg-primary'"
			>
				{{ message }}
			</p>
		</div>
	</div>
</template>
