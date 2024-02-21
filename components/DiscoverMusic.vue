<script lang="ts" setup>
const { getRandomMusic } = useFirebaseFunction()
const music = ref({} as any)

onMounted(async () => {
  music.value = await getRandomMusic()
  console.log('music', music.value)
})

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const musicNamePlaying = useMusicNamePlaying()
const authorNamePlaying = useAuthorNamePlaying()
const imageLoaded = ref(false)

const playVideo = (videoId: any) => {
  // console.log('playVideo', videoId)
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
  musicNamePlaying.value = music.value.name
  authorNamePlaying.value = music.value.artists[0].name
}
</script>

<template>
  <div>
    <div v-if="music && music?.artists">
      <button
        @click="playVideo(music.videoId)"
        class="group relative aspect-square max-h-96 w-full overflow-hidden rounded-lg bg-quinary drop-shadow-lg"
      >
        <div v-if="music.thumbnails.length" class="relative h-full w-full">
          <div
            class="absolute inset-0 h-full w-full bg-quinary transition-all duration-500 ease-in-out"
            :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
          />
          <NuxtImg
            :alt="music.name"
            :src="music.thumbnails[3].url"
            @load="imageLoaded = true"
            class="h-full w-full rounded object-cover"
          />
        </div>
        <div class="absolute inset-0 flex flex-col justify-between bg-quinary/70 p-3">
          <div class="space-y-1 text-left">
            <p v-if="music.name" class="font-semibold text-xl">
              {{ music.name }}
            </p>
            <p v-if="music.artists && music.artists.length > 0">
              {{ music.artists[0].name }}
            </p>
          </div>
          <div class="flex justify-end">
            <IconPause
              v-if="isPlayingVideo && idYoutubeVideo === music.videoId"
              class="h-10 w-10 group-hover:text-primary transition-all duration-500 ease-in-out"
            />
            <IconPlay
              v-else
              class="h-10 w-10 group-hover:text-primary transition-all duration-500 ease-in-out"
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
