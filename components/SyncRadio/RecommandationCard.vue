<script setup lang="ts">
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
	const { getRandomMusic } = useFirebaseFunction()

	const { isAdminRoom } = defineProps<{
		isAdminRoom: boolean
	}>()

	const emit = defineEmits(['addInPlaylist'])

	const music = ref(null)

	const musicName = computed(() => music.value?.name)
	const musicArtists = computed(() => music.value?.artists[0]?.name)
	const hasMv = computed(() => music.value?.ismv || false)

	onMounted(async () => {
		music.value = await getRandomMusic(new Date().getFullYear())
	})

	const reloadRandomMusic = async () => {
		music.value = null
		music.value = await getRandomMusic(new Date().getFullYear())
	}

	const addInPlaylist = () => {
		emit('addInPlaylist', music.value.videoId)
		reloadRandomMusic()
	}

	const sendMusic = () => {
		// console.log('sendMusic')
	}

	defineExpose({
		reloadRandomMusic,
	})
</script>

<template>
	<div>
		<div v-if="music" class="flex w-full items-center justify-between py-3.5">
			<div class="max-w-[60%] flex-grow space-y-2">
				<div class="relative h-[14px]">
					<p
						class="truncate text-sm font-semibold hover:absolute hover:z-10 hover:overflow-auto hover:bg-quinary"
					>
						{{ musicName }}
					</p>
				</div>
				<div class="flex gap-1 text-xs">
					<p class="truncate">{{ musicArtists }}</p>
					<p v-if="hasMv" class="rounded bg-primary px-1 font-semibold">MV</p>
				</div>
			</div>
			<div class="space-x-2">
				<button
					class="rounded-lg bg-quaternary p-2 transition-all duration-300 ease-in-out hover:bg-primary"
					@click="reloadRandomMusic"
				>
					<IconReload class="h-4 w-4" />
				</button>
				<button
					v-if="isAdminRoom"
					class="rounded-lg bg-quaternary p-2 transition-all duration-300 ease-in-out hover:bg-primary"
					@click="addInPlaylist"
				>
					<IconPlus class="h-4 w-4" />
				</button>
				<button
					v-else
					disabled
					class="rounded-lg bg-quaternary p-2 transition-all duration-300 ease-in-out hover:bg-primary disabled:bg-secondary/30 disabled:text-tertiary/20 disabled:hover:bg-secondary/30"
					@click="sendMusic"
				>
					<IconSend class="h-4 w-4" />
				</button>
			</div>
		</div>
		<SkeletonDefault v-else class="my-2 h-10 rounded-lg" />
	</div>
</template>
