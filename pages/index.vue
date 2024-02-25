<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'

const { getNextComebacks, getLastReleases, getLastArtistsAdded, getRandomMusic } = useFirebaseFunction()

const comebacks = ref([] as any[])
const artists = ref([] as any[])
const releases = ref([] as any[])

const unsubscribeComeback = ref(null as any)
const unsubscribeRelease = ref(null as any)
const unsubscribeArtist = ref(null as any)

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
  unsubscribeComeback.value = getNextComebacks(
    Timestamp.fromDate(comebacksDate),
    (cb: any) => {
      comebacks.value = cb
    },
  )

  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 8)
  unsubscribeRelease.value = getLastReleases(
    Timestamp.fromDate(releaseDate),
    8,
    (rel: any) => {
      releases.value = rel
    },
  )

  unsubscribeArtist.value = getLastArtistsAdded(8, (art: any) => {
    artists.value = art
  })
})

onBeforeUnmount(() => {
  unsubscribeComeback.value()
  unsubscribeRelease.value()
  unsubscribeArtist.value()
})

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
    <section class="container mx-auto space-y-16 px-10 py-16 2xl:space-y-28">
      <!-- Comeback Reported List -->
      <ComebackReported :comebackList="comebacks" />
      <!-- Discover Music -->
      <div class="space-y-8 xl:space-y-110 2xl:space-y-14">
        <p class="text-center text-xl font-bold lg:text-4xl">Discover Music</p>
        <div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
          <LazyDiscoverMusic ref="discoverOne" />
          <LazyDiscoverMusic ref="discoverTwo" />
          <LazyDiscoverMusic ref="discoverThree" />
          <LazyDiscoverMusic ref="discoverFour" />
        </div>
      </div>
      <!-- Recent Release -->
      <RecentReleases :releases="releases" />
      <!-- Last Artist Added -->
      <ArtistAdded :artists="artists" />
    </section>
  </div>
</template>
