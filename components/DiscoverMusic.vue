<template>
  <div v-if="release != null">
    <button @click="playVideo(release.videoId)" class="group relative aspect-square max-h-96 w-full overflow-hidden rounded-lg bg-quinary drop-shadow-lg">
      <NuxtImg :src="release.thumbnails[3].url" loading="lazy" class="h-full w-full rounded object-cover" />
      <div class="absolute inset-0 flex flex-col items-center justify-evenly gap-8 bg-secondary/50 py-10">
        <p class="text-3xl font-semibold">Discover Music</p>
        <IconPlay class="h-14 w-14 rounded-full border border-tertiary group-hover:bg-tertiary group-hover:text-quaternary" />
        <div class="space-y-3 text-center">
          <p class="text-2xl font-semibold">{{ release.name }}</p>
          <p>{{ release.album.name }}</p>
          <p>{{ release.artists[0].name }}</p>
        </div>
      </div>
    </button>
    <div class="flex w-full justify-end">
      <button @click="reloadedSong" class="w-fit text-xs font-semibold uppercase hover:text-primary">Reload</button>
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
