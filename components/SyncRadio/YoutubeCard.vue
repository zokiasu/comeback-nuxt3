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
			'bg-primary': isActualPlaying,
			'bg-quaternary': !isActualPlaying,
		}"
		@click="playVideo"
	>
		<NuxtImg
			:src="urlPicture"
			:alt="name"
			class="hidden h-full min-h-full min-w-[20%] max-w-[20%] rounded object-cover lg:block"
		/>
		<div class="relative h-full w-full truncate text-sm">
			<p class="truncate font-semibold">{{ name }}</p>
			<p class="text-xs">{{ channelName }}</p>
			<div class="hidden gap-1 text-xs lg:flex">
				<p>Added by</p>
				<p class="font-semibold">{{ userName }}</p>
			</div>
			<div
				class="absolute bottom-0 right-0 items-center gap-2 2xl:hidden"
				:class="isAdmin ? '2xl:group-hover:flex' : ''"
			>
				<button @click="deleteInPlaylist">
					<IconDelete class="h-3.5 w-3.5 cursor-pointer hover:text-primary" />
				</button>
			</div>
		</div>
	</button>
</template>
