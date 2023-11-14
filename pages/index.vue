<script setup lang="ts">
import { Timestamp } from 'firebase/firestore'

const { getNextComebacks } = useFirebaseFunction()

const comebacks = ref([] as any[])
const artists = ref([] as any[])
const releases = ref([] as any[])

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
  comebacks.value = await getNextComebacks(Timestamp.fromDate(comebacksDate))

  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 8)
  releases.value = await fetchReleasesWithDateAndLimit(Timestamp.fromDate(releaseDate), 8)

  const artistDate = new Date()
  artists.value = await fetchArtistsWithLimit(Timestamp.fromDate(artistDate), 8)
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
    <section class="container mx-auto space-y-16 px-10 py-16">
      <!-- Comeback Reported List -->
      <ComebackReported :comebackList="comebacks" />
      <!-- <pre>
        {{ music }}
      </pre> -->
      <!-- Discover Music -->
      <div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
        <DiscoverMusic />
        <DiscoverMusic />
        <DiscoverMusic />
        <DiscoverMusic />
      </div>
      <!-- Recent Release -->
      <RecentReleases :releases="releases" />
      <!-- Last Artist Added -->
      <ArtistAdded :artists="artists" />
    </section>
  </div>
</template>
