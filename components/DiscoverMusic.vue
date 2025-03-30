<script setup lang="ts">
	import type { Music } from '~/types/supabase/music'

	const props = defineProps({
		music: {
			type: Object as PropType<Music>,
			default: {},
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
	<div>
		<div v-if="music && music?.artists">
			<button
				class="group relative aspect-square max-h-96 w-full overflow-hidden rounded-lg bg-quinary drop-shadow-lg"
				@click="playVideo(music.id_youtube_music)"
			>
				<div v-if="music.thumbnails?.length" class="relative h-full w-full">
					<div
						class="absolute inset-0 h-full w-full bg-quinary transition-all duration-500 ease-in-out"
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
					class="absolute inset-0 flex flex-col justify-between bg-quinary/70 p-2 lg:p-3"
				>
					<div class="space-y-1 text-left">
						<NuxtLink
							v-if="music.name"
							:to="'/release/' + music.id"
							class="font-semibold transition-all duration-300 ease-in-out hover:text-primary lg:text-xl"
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
							class="h-8 w-8 transition-all duration-500 ease-in-out group-hover:text-primary md:h-10 md:w-10"
						/>
						<IconPlay
							v-else
							class="h-8 w-8 transition-all duration-500 ease-in-out group-hover:text-primary md:h-10 md:w-10"
						/>
					</div>
				</div>
			</button>
		</div>
		<SkeletonDefault
			v-else
			class="aspect-square h-full max-h-96 w-full rounded-lg bg-quinary drop-shadow-lg"
		/>
	</div>
</template>
