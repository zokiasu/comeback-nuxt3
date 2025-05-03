<script setup lang="ts">
	import type { Music } from '~/types/supabase/music'

	const props = defineProps({
		music: {
			type: Object as PropType<Music>,
			default: null,
		},
	})

	const idYoutubeVideo = useIdYoutubeVideo()
	const isPlayingVideo = useIsPlayingVideo()
	const musicNamePlaying = useMusicNamePlaying()
	const authorNamePlaying = useAuthorNamePlaying()
	const imageLoaded = ref(false)

	const playVideo = (videoId: string) => {
		idYoutubeVideo.value = videoId
		isPlayingVideo.value = true
		musicNamePlaying.value = props.music.name
		authorNamePlaying.value = props.music?.artists?.[0]?.name || ''
	}
</script>

<template>
	<div v-if="music && music?.artists">
		<UButton
			class="bg-cb-quinary-900 text-cb-tertiary-200 hover:text-cb-primary-900 relative aspect-square max-h-96 w-full overflow-hidden rounded-lg drop-shadow-lg !p-0"
			@click="playVideo(music.id_youtube_music)"
		>
			<div v-if="music.thumbnails?.length" class="relative h-full w-full">
				<div
					class="bg-cb-quinary-900 absolute inset-0 h-full w-full transition-all duration-500 ease-in-out"
					:class="imageLoaded ? 'opacity-0' : 'opacity-100'"
				/>
				<NuxtImg
					:alt="music.name"
					:src="music.thumbnails?.[2]?.url"
					class="h-full w-full rounded object-cover"
					@load="imageLoaded = true"
				/>
			</div>
			<div
				class="bg-cb-quinary-900/70 absolute inset-0 flex flex-col justify-between p-2 lg:p-3"
			>
				<div class="space-y-1 text-left">
					<NuxtLink
						v-if="music.name"
						:to="'/release/' + music.releases?.[0]?.id"
						class="hover:text-cb-primary-900 font-semibold transition-all duration-300 ease-in-out lg:text-xl"
					>
						{{ music.name }}
					</NuxtLink>
					<p v-if="music.artists && music.artists.length > 0">
						{{ music.artists[0].name }}
					</p>
				</div>
				<div class="flex justify-end">
					<IconPause
						v-if="isPlayingVideo && idYoutubeVideo === music.id_youtube_music"
						class="h-8 w-8 transition-all duration-500 ease-in-out md:h-10 md:w-10"
					/>
					<IconPlay
						v-else
						class="h-8 w-8 transition-all duration-500 ease-in-out md:h-10 md:w-10"
					/>
				</div>
			</div>
		</UButton>
	</div>
	<SkeletonDefault
		v-else
		class="bg-cb-quinary-900 aspect-square h-full max-h-96 w-full rounded-lg drop-shadow-lg"
	/>
</template>
