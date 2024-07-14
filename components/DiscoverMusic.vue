<script lang="ts" setup>
const { getRandomMusic } = useFirebaseFunction()
const music = ref({} as any)

onMounted(async () => {
  music.value = await getRandomMusic()
  console.log('Music', music.value)
})

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const musicNamePlaying = useMusicNamePlaying()
const authorNamePlaying = useAuthorNamePlaying()
const imageLoaded = ref(false)

const playVideo = (videoId: any) => {
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
  musicNamePlaying.value = music.value.name
  authorNamePlaying.value = music.value.artists[0].name
}

const reloadRandomMusic = async () => {
  music.value = {}
  music.value = await getRandomMusic()
  imageLoaded.value = false
}

defineExpose({
  reloadRandomMusic,
  music
})
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
            :src="music.thumbnails[2].url"
            @load="imageLoaded = true"
            class="h-full w-full rounded object-cover"
          />
        </div>
        <div class="absolute inset-0 flex flex-col justify-between bg-quinary/70 p-2 lg:p-3">
          <div class="space-y-1 text-left">
            <NuxtLink
              v-if="music.name"
              :to="'/release/' + music.id"
              class="font-semibold lg:text-xl hover:text-primary transition-all duration-300 ease-in-out"
            >
              {{ music.name }}
            </NuxtLink>
            <p v-if="music.artists && music.artists.length > 0">
              {{ music.artists[0].name }}
            </p>
          </div>
          <div class="flex justify-end">
            <IconPause
              v-if="isPlayingVideo && idYoutubeVideo === music.videoId"
              class="h-8 w-8 md:h-10 md:w-10 group-hover:text-primary transition-all duration-500 ease-in-out"
            />
            <IconPlay
              v-else
              class="h-8 w-8 md:h-10 md:w-10 group-hover:text-primary transition-all duration-500 ease-in-out"
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
