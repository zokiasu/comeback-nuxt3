<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'

const { getRealtimeNextComebacks, getRealtimeLastestReleases, getRealtimeLastestArtistsAdded, getRandomMusic } = useFirebaseFunction()

const comebacks = ref([] as any[])
const artists = ref([] as any[])
const releases = ref([] as any[])

const discoverOne = ref(null)
const discoverTwo = ref(null)
const discoverThree = ref(null)
const discoverFour = ref(null)

const comebacksToday = computed(() => {
  return comebacks.value.filter((comebacks: any) => {
    const comebacksDate = new Date(comebacks.date.seconds * 1000)
    const today = new Date()
    return (
      comebacksDate.getDate() === today.getDate() &&
      comebacksDate.getMonth() === today.getMonth() &&
      comebacksDate.getFullYear() === today.getFullYear()
    )
  })
})

onMounted(async () => {
  const comebacksDate = new Date()
  comebacksDate.setDate(comebacksDate.getDate() - 1)
  await getRealtimeNextComebacks(Timestamp.fromDate(comebacksDate), (cb: any) => { comebacks.value = cb })

  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 8)
  await getRealtimeLastestReleases(Timestamp.fromDate(releaseDate), 8, (rel: any) => { releases.value = rel })

  await getRealtimeLastestArtistsAdded(8, (art: any) => { artists.value = art })
})

const reloadDiscoverMusic = async () => {
  discoverOne.value?.reloadRandomMusic()
  discoverTwo.value?.reloadRandomMusic()
  discoverThree.value?.reloadRandomMusic()
  discoverFour.value?.reloadRandomMusic()
}

useHead({
  title: 'Comeback',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    {
      name: 'robots',
      content: 'noindex,nofollow',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      hid: 'description',
      name: 'description',
      content:
        "Don't miss any Comeback. Track every next release by your favorite artists.",
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: 'Comeback - Track every next release by your favorite artists.',
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'website',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: 'Comeback - Track every next release by your favorite artists.',
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content:
        "Don't miss any Comeback. Track every next release by your favorite artists.",
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: 'https://come-back.netlify.app/',
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://nuxt-firebase-auth.vercel.app/ogp.png',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <div>
    <!-- Home Header -->
    <HomeSlider :news-today="comebacksToday" />
    <!-- Home Body -->
    <section class="container mx-auto space-y-16 p-5 py-10 2xl:space-y-28">
      <!-- Comeback Reported List -->
      <ComebackReported :comebackList="comebacks" />
      <!-- Discover Music -->
      <div class="text-center space-y-8 xl:space-y-10 2xl:space-y-14">
        <p class="text-xl font-bold lg:text-4xl">Discover Music</p>
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
            <LazyDiscoverMusic ref="discoverOne" />
            <LazyDiscoverMusic ref="discoverTwo" />
            <LazyDiscoverMusic ref="discoverThree" />
            <LazyDiscoverMusic ref="discoverFour" />
          </div>
          <button @click="reloadDiscoverMusic()" class="px-3 py-1 rounded bg-quaternary">
            Reload
          </button>
        </div>
      </div>
      <!-- Recent Release -->
      <RecentReleases :releases="releases" />
      <!-- Last Artist Added -->
      <ArtistAdded :artists="artists" />
    </section>
  </div>
</template>
