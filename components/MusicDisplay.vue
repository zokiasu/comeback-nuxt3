<script setup lang="ts">
	const {
		musicName,
		musicId,
		duration,
		artistName,
		artistId,
		artistImage,
		albumName,
		albumId,
		musicImage,
		ismv,
		horizontalMode,
	} = defineProps({
		musicName: {
			type: String,
			required: true,
		},
		artistName: {
			type: String,
			required: true,
		},
		artistId: {
			type: String,
		},
		albumId: {
			type: String,
		},
		albumName: {
			type: String,
		},
		duration: {
			type: [String, Number],
		},
		artistImage: {
			type: String,
		},
		musicImage: {
			type: String,
			required: true,
		},
		musicId: {
			type: String,
			required: true,
		},
		musicDate: {
			type: String,
		},
		ismv: {
			type: Boolean,
		},
		horizontalMode: {
			type: Boolean,
		},
	})

	const idYoutubeVideo = useIdYoutubeVideo()
	const isPlayingVideo = useIsPlayingVideo()
	const musicNamePlaying = useMusicNamePlaying()
	const authorNamePlaying = useAuthorNamePlaying()

	const displayVideo = ref(false)

	const playVideo = (videoId: any) => {
		idYoutubeVideo.value = videoId
		isPlayingVideo.value = true
		musicNamePlaying.value = musicName
		authorNamePlaying.value = artistName || ''
	}

	const convertDuration = (duration: string | number) => {
		const durationNumber = typeof duration === 'string' ? parseInt(duration) : duration
		const minutes = Math.floor(durationNumber / 60)
		const seconds = durationNumber % 60
		if (seconds < 10) return `${minutes}:0${seconds}`
		return `${minutes}:${seconds}`
	}
</script>

<template>
	<div
		class="grid w-full bg-transparent"
		:class="ismv && horizontalMode ? 'grid-cols-5 gap-2' : 'grid-cols-1 gap-0.5'"
	>
		<button
			v-if="musicId"
			:disabled="idYoutubeVideo == musicId"
			class="bg-cb-quaternary-950 cursor-pointer col-span-1 flex w-full items-center gap-2 rounded p-2 px-3"
			:class="{
				'group hover:bg-cb-tertiary-200/10': idYoutubeVideo != musicId,
				'col-span-4': ismv && horizontalMode,
			}"
			@click="playVideo(musicId)"
		>
			<div class="hidden w-10 shrink-0 md:block">
				<NuxtImg
					v-if="musicImage != null || musicImage != undefined"
					format="webp"
					:alt="musicName"
					:src="musicImage"
					class="shadow-cb-secondary-950 h-10 w-10 rounded shadow"
				/>
			</div>
			<div class="min-w-0 flex-1 overflow-hidden">
				<div v-if="musicName" class="flex w-full items-center gap-2 text-start">
					<p class="truncate text-sm font-semibold">
						{{ musicName }}
					</p>
					<p class="hidden md:block">-</p>
					<p class="hidden text-right md:block">{{ convertDuration(duration) }}</p>
				</div>
				<div
					v-if="artistName || albumId"
					class="flex min-w-0 items-center gap-2 overflow-hidden text-xs"
				>
					<NuxtImg
						v-if="artistImage"
						format="webp"
						:alt="artistName"
						:src="artistImage"
						class="shadow-cb-secondary-950 h-3 w-3 rounded-full object-cover shadow"
					/>
					<NuxtLink
						v-if="artistName && artistId"
						:to="`/artist/${artistId}`"
						class="whitespace-nowrap hover:underline"
					>
						{{ artistName }}
					</NuxtLink>
					<p v-if="artistName && !artistId" class="whitespace-nowrap">
						{{ artistName }}
					</p>
					<p v-if="albumId" class="truncate text-xs md:block">-</p>
					<NuxtLink
						v-if="albumId"
						:to="`/release/${albumId}`"
						class="truncate text-xs hover:underline md:block"
					>
						{{ albumName }}
					</NuxtLink>
					<!-- <p class="hidden sm:block">1, 054, 258, 031 on Youtube (Music)</p> -->
				</div>
			</div>
			<div class="flex w-10 shrink-0 justify-center">
				<IconPlay
					v-if="idYoutubeVideo != musicId"
					class="h-10 w-10 transition-all duration-300 ease-in-out"
				/>
				<IconPause v-else class="h-10 w-10 transition-all duration-300 ease-in-out" />
			</div>
		</button>
		<button
			v-if="ismv"
			class="bg-cb-primary-900 hover:bg-cb-primary-900/50 flex w-full items-center justify-center rounded px-2 py-1 text-xs font-semibold tracking-widest uppercase"
			:class="horizontalMode ? 'w-fit' : 'w-full'"
			@click="displayVideo = true"
		>
			<p class="hidden lg:block">Music Video</p>
			<p class="lg:hidden">M/V</p>
		</button>
		<div
			v-if="displayVideo && ismv"
			class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/80 lg:gap-10"
			@click="displayVideo = false"
		>
			<iframe
				class="aspect-video w-full md:w-[80%] lg:w-[60%]"
				:src="`https://www.youtube.com/embed/` + musicId"
				:title="musicName + ' M/V'"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>

			<p class="text-cb-tertiary-200/80 hover:text-cb-tertiary-200 cursor-pointer">
				Close M/V
			</p>
		</div>
	</div>
</template>
