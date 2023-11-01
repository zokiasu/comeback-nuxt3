<script setup lang="ts">
import { type Release } from '@/types/release'

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()

const title = ref('Release Page')
const description = ref('Release')

const release = ref<Release>({} as Release)
const imageLoaded = ref(false)

const playVideo = (videoId: string) => {
  idYoutubeVideo.value = videoId
  isPlayingVideo.value = true
}

onMounted(async () => {
  const route = useRoute()
  release.value = (await fetchReleaseById(route.params.id as string)) as Release
  console.log(release.value)
  title.value = release.value.name
  description.value = release.value.name
})

useHead({
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
})
</script>

<template>
  <div class="container mx-auto space-y-5 p-5">
    <!-- Title & Link -->
    <section id="title">
      <h1 v-if="release.name" class="text-2xl font-semibold xl:text-4xl">
        {{ release.name }}
      </h1>
      <SkeletonDefault v-else class="h-8 w-3/4 rounded" />
      <div v-if="release.name" class="flex gap-2">
        <p>{{ release.type }}</p>
        <p>-</p>
        <NuxtLink :to="`/artist/${release.artistsId}`" class="hover-underline-animation">
          {{ release.artistsName }}
        </NuxtLink>
      </div>
      <SkeletonDefault v-else class="h-5 w-2/5 rounded" />
    </section>
    <!-- Tracks List -->
    <section id="tracks">
      <div v-if="release.musics" class="space-y-5">
        <button
          v-for="music in release.musics"
          :key="`music_` + music.id"
          target="_blank"
          @click="playVideo(music.videoId)"
          class="group flex w-full items-center justify-between gap-5"
        >
          <h3 class="text-xl font-semibold">{{ music.name }}</h3>
          <button
            @click="playVideo(music.videoId)"
            class="rounded px-2 text-xs font-semibold uppercase transition-all duration-300 ease-in-out group-hover:bg-tertiary group-hover:text-secondary"
          >
            <IconPlay class="h-6 w-6" />
          </button>
        </button>
      </div>
      <div v-else class="space-y-2">
        <SkeletonDefault v-for="i in 8" :key="`tracks_` + i" class="h-8 w-full rounded" />
      </div>
    </section>
  </div>
</template>
