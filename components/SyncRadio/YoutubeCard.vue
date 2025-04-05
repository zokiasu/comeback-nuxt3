<script setup lang="ts">
	const { urlPicture, name, channelName, userName, isAdmin, isActualPlaying } =
		defineProps<{
			urlPicture: string
			name: string
			channelName: string
			userName: string
			isAdmin: boolean
			isActualPlaying: boolean
		}>()

	const emit = defineEmits(['deleteInPlaylist', 'playVideo'])

	const deleteInPlaylist = () => {
		emit('deleteInPlaylist')
	}

	const playVideo = () => {
		emit('playVideo')
	}
</script>

<template>
	<button
		class="relative flex w-full items-center gap-3 rounded-lg p-2 text-start"
		:class="{
			group: isAdmin,
			'bg-primary-900': isActualPlaying,
			'bg-quaternary-950': !isActualPlaying,
		}"
		@click="playVideo"
	>
		<NuxtImg
			:src="urlPicture"
			:alt="name"
			class="hidden h-full min-h-full max-w-[20%] min-w-[20%] rounded object-cover lg:block"
		/>
		<div class="relative h-full w-full truncate text-sm">
			<p class="truncate font-semibold">{{ name }}</p>
			<p class="text-xs">{{ channelName }}</p>
			<div class="hidden gap-1 text-xs lg:flex">
				<p>Added by</p>
				<p class="font-semibold">{{ userName }}</p>
			</div>
			<div
				class="absolute right-0 bottom-0 items-center gap-2 2xl:hidden"
				:class="isAdmin ? '2xl:group-hover:flex' : ''"
			>
				<button @click="deleteInPlaylist">
					<IconDelete class="hover:text-primary-900 h-3.5 w-3.5 cursor-pointer" />
				</button>
			</div>
		</div>
	</button>
</template>
