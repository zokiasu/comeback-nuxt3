<template>
  <NuxtLink
    :to="objectLink"
    class="group min-w-[10rem] max-w-[10rem] space-y-3 rounded bg-quaternary p-4 shadow-xl shadow-secondary transition-all duration-500 ease-in-out"
  >
    <div class="relative">
      <div
        :class="`absolute inset-0 aspect-square w-full bg-primary object-cover transition-all duration-500 ease-in-out ${
          isArtist ? 'rounded-full' : 'rounded'
        } ${imageLoaded ? 'opacity-0' : 'opacity-100'}`"
      ></div>
      <NuxtImg
        :src="image"
        class="aspect-square w-full object-cover shadow-xl shadow-secondary"
        @load="imageLoaded = true"
        :class="isArtist ? 'rounded-full' : 'rounded'"
      />
      <div v-if="!isArtist && releaseDate" class="absolute top-1 left-1 text-xs uppercase bg-quaternary px-1.5 rounded opacity-0 group-hover:opacity-100">
        <p>
          {{ formatDate(releaseDate) }}
        </p>
      </div>
      <div v-if="!isArtist && releaseType" class="absolute bottom-1 right-1 text-xs uppercase bg-quaternary px-1.5 rounded opacity-0 group-hover:opacity-100">
        <p>
          {{ releaseType }}
        </p>
      </div>
    </div>
    <div class="space-y-1.5 text-xs">
      <p class="font-semibol truncate group-hover:underline">
        {{ mainTitle }}
      </p>
      <p v-if="isArtist || isReleaseDisplay" class="truncate">{{ subTitle }}</p>
      <LazyNuxtLink
        v-else
        :to="`/artist/${artistId}`"
        class="truncate hover:underline"
      >
        {{ subTitle }}
      </LazyNuxtLink>
    </div>
  </NuxtLink>
</template>

<script setup>
const { isArtist, artistId, mainTitle, subTitle, image, objectLink } = defineProps({
  isArtist: {
    type: Boolean,
    default: false,
  },
  artistId: {
    type: String,
  },
  mainTitle: {
    type: String,
    default: 'Main Title',
  },
  subTitle: {
    type: String,
    default: 'Subtitle',
  },
  image: {
    type: String,
    default: 'https://picsum.photos/200/200',
  },
  objectLink: {
    type: String,
    default: '/',
  },
  releaseDate: {
    type: Object
  },
  releaseType: {
    type: String,
    default: 'album',
  },
  isReleaseDisplay: {
    type: Boolean,
    default: false,
  },
})
const imageLoaded = ref(false)

const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', year: '2-digit' }
  return new Date(date.seconds * 1000).toLocaleDateString('fr-FR', options)
}
</script>
