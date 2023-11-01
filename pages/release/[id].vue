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
  title.value = release.value.name + ' by ' + release.value.artistsName
  description.value = release.value.name + ' by ' + release.value.artistsName
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
  <div
    class="mx-auto w-full space-y-12 px-10 py-12 2xl:container xl:flex xl:min-h-[100vh-100px] xl:flex-col xl:items-center xl:justify-center"
  >
    <!-- Title & Link -->
    <section id="title" class="mx-auto w-[16rem] space-y-2 sm:w-[30rem] xl:w-full">
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
    <div
      class="mx-auto w-fit space-y-12 xl:flex xl:w-full xl:justify-between xl:gap-10 xl:space-y-0"
    >
      <!-- Image -->
      <section id="image" class="xl:h-full xl:w-full">
        <div v-if="release.image" class="relative">
          <div
            class="absolute inset-0 z-50 aspect-square w-[16rem] bg-quinary sm:w-[30rem] sm:rounded-md"
            :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
          ></div>
          <NuxtImg
            format="webp"
            loading="lazy"
            :src="release.image"
            :alt="release.name"
            @load="imageLoaded = true"
            class="aspect-square w-[16rem] object-cover shadow-2xl shadow-quinary sm:w-[30rem] sm:rounded-md"
          />
        </div>
        <SkeletonDefault
          v-else
          class="aspect-square w-[16rem] rounded sm:w-[30rem] sm:rounded-md"
        />
      </section>
      <!-- Tracks List -->
      <section id="tracks" class="w-[16rem] sm:w-[30rem] xl:h-full xl:w-full">
        <div v-if="release.musics" class="space-y-5">
          <button
            v-for="music in release.musics"
            :key="`music_` + music.id"
            target="_blank"
            @click="playVideo(music.videoId)"
            class="group flex w-full items-center justify-between gap-5"
          >
            <h3 class="text-xl font-semibold">{{ music.name }}</h3>
            <di
              class="rounded px-2 text-xs font-semibold uppercase transition-all duration-300 ease-in-out group-hover:bg-tertiary group-hover:text-secondary"
            >
              <IconPlay class="h-6 w-6" />
            </di>
          </button>
        </div>
        <div v-else class="space-y-2">
          <SkeletonDefault
            v-for="i in 8"
            :key="`tracks_` + i"
            class="h-8 w-full rounded"
          />
        </div>
      </section>
    </div>
  </div>
</template>
