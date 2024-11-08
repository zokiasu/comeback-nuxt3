<script setup lang="ts">
const { musicName, musicId, duration, artistName, artistId, artistImage, albumName, albumId, musicImage } = defineProps({
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
    required: true,
  },
  albumId: {
    type: String,
  },
  albumName: {
    type: String,
  },
  duration: {
    type: String,
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
  hasMv: {
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

const convertDuration = (duration: any) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  if (seconds < 10) return `${minutes}:0${seconds}`
  return `${minutes}:${seconds}`
}
</script>

<template>
  <div class="bg-transparent w-full grid" :class="hasMv && horizontalMode ? 'grid-cols-5 gap-2' : 'grid-cols-1 gap-0.5'">
    <button
      v-if="musicId"
      @click="playVideo(musicId)"
      :disabled="idYoutubeVideo == musicId"
      class="flex gap-2 w-full items-center rounded bg-quaternary p-2 px-3 col-span-1"
      :class="{
        'group hover:bg-tertiary/10': idYoutubeVideo != musicId,
        'col-span-4': hasMv && horizontalMode,
      }"
    >
      <div class="shrink-0 w-10 hidden md:block">
        <NuxtImg
          v-if="musicImage != null || musicImage != undefined"
          format="webp"
          :alt="musicName"
          :src="musicImage"
          class="h-10 w-10 rounded shadow shadow-secondary"
        />
      </div>
      <div class="flex-1 min-w-0 overflow-hidden">
        <div v-if="musicName" class="flex items-center gap-2 text-start w-full">
          <p class="truncate text-sm font-semibold">
            {{ musicName }}
          </p>
          <p class="hidden md:block">-</p>
          <p class="hidden md:block text-right">{{ convertDuration(duration) }}</p>
        </div>
        <div v-if="artistName || albumId" class="flex items-center gap-2 text-xs min-w-0 overflow-hidden">
          <NuxtImg
            v-if="artistImage"
            format="webp"
            :alt="artistName"
            :src="artistImage"
            class="h-3 w-3 rounded-full object-cover shadow shadow-secondary"
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
      <div class="shrink-0 w-10 flex justify-center">
        <IconPlay
          v-if="idYoutubeVideo != musicId"
          class="h-10 w-10 transition-all duration-300 ease-in-out"
        />
        <IconPause v-else class="h-10 w-10 transition-all duration-300 ease-in-out" />
      </div>
    </button>
    <button v-if="hasMv" @click="displayVideo = true" class="flex items-center w-full text-xs py-1 px-2 uppercase font-semibold tracking-widest justify-center rounded bg-primary hover:bg-primary/50" :class="horizontalMode ? 'w-fit' : 'w-full'">
      <p class="hidden lg:block">Music Video</p>
      <p class="lg:hidden">M/V</p>
    </button>
    <div v-if="displayVideo && hasMv" @click="displayVideo = false" class="fixed inset-0 flex flex-col items-center gap-5 lg:gap-10 justify-center bg-black/80 z-50">
      <iframe 
        class="w-full md:w-[80%] lg:w-[60%] aspect-video" 
        :src="`https://www.youtube.com/embed/` + musicId" 
        :title="musicName + ' M/V'" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
      ></iframe>

      <p class="text-tertiary/80 cursor-pointer hover:text-tertiary">Close M/V</p>
    </div>
  </div>
</template>
