<template>
  <div>
    <div v-if="music.name">
      <button
        @click="playVideo(music.videoId)"
        class="group relative aspect-square max-h-96 w-full overflow-hidden rounded-lg bg-quinary drop-shadow-lg"
      >
        <div v-if="music.thumbnails" class="relative">
          <div
            class="absolute inset-0 h-full w-full bg-quinary transition-all duration-500 ease-in-out"
            :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
          />
          <NuxtImg
            format="webp"
            loading="lazy"
            :alt="music.name"
            :src="music.thumbnails[music.thumbnails.length - 1].url"
            @load="imageLoaded = true"
            class="h-full w-full rounded object-cover"
          />
        </div>
        <div
          class="absolute inset-0 flex flex-col items-center justify-evenly gap-8 bg-quinary/50 py-5"
        >
          <p class="text-3xl font-semibold">Discover Music</p>
          <IconPlay
            class="h-14 w-14 rounded-full border border-tertiary group-hover:bg-tertiary group-hover:text-quaternary"
          />
          <div class="space-y-3 text-center">
            <p class="text-xl font-semibold">{{ music.name }}</p>
            <p>{{ music.album.name }}</p>
            <p>{{ music.artists[0].name }}</p>
          </div>
        </div>
      </button>
    </div>
    <SkeletonDefault v-else class="h-96 w-full rounded-lg bg-quinary drop-shadow-lg" />
  </div>
</template>

<script lang="ts" setup>
const { getRandomMusic } = useFirebaseFunction()
const music = ref({} as any)

onMounted(async () => {
  music.value = await getRandomMusic()
})

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const imageLoaded = ref(false)

const playVideo = (videoId: any) => {
  console.log('playVideo', videoId)
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
}
</script>
