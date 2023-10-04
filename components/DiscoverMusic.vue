<template>
  <div v-if="release != null">
    <button @click="playVideo(release.videoId)" class="group bg-quinary drop-shadow-lg rounded-lg aspect-square max-h-96 relative w-full overflow-hidden">
      <NuxtImg
        :src="release.thumbnails[3].url"
        loading="lazy"
        class="w-full h-full object-cover rounded"
      />
      <div class="absolute inset-0 bg-secondary/50 flex flex-col py-10 justify-evenly items-center gap-8">
        <p class="text-3xl font-semibold">Discover Music</p>
        <IconPlay class="w-14 h-14 border border-tertiary rounded-full group-hover:text-quaternary group-hover:bg-tertiary" />
        <div class="text-center space-y-3">
          <p class="text-2xl font-semibold">{{ release.name }}</p>
          <p>{{ release.album.name }}</p>
          <p>{{ release.artists[0].name }}</p>
        </div>
      </div>
    </button>
    <div class="w-full flex justify-end">
      <button @click="reloadedSong" class="text-xs w-fit uppercase font-semibold hover:text-primary">Reload</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()
const release = ref<any>(null)

const playVideo = (videoId: any) => {
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
}

onMounted(async () => {
  release.value = await getRandomSong()
  console.log(release.value)
})

const reloadedSong = async () => {
  getRandomSong().then((res) => {
    release.value = res
  })
}
</script>
