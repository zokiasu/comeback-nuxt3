<script setup lang="ts">
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'

const { $firestore: db } = useNuxtApp()

const comebacks = ref([] as any[])
const artists = ref([] as any[])
const releases = ref([] as any[])

const comebacksFetched = ref(false)

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
  comebacksFetching()

  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 8)
  releases.value = await fetchReleasesWithDateAndLimit(Timestamp.fromDate(releaseDate), 8)

  const artistDate = new Date()
  artists.value = await fetchArtistsWithLimit(Timestamp.fromDate(artistDate), 8)
})

const comebacksFetching = () => {
  const comebacksDate = new Date()
  comebacksDate.setDate(comebacksDate.getDate() - 1)
  const q = query(
    collection(db as any, 'comebacks'),
    where('date', '>=', Timestamp.fromDate(comebacksDate)),
    orderBy('date', 'asc'),
  )
  onSnapshot(q, (querySnapshot) => {
    const comebacksTmp: any[] = []
    querySnapshot.forEach((doc) => {
      comebacksTmp.push(doc.data())
    })
    comebacks.value = comebacksTmp
    comebacksFetched.value = true
  })
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
      content: 'https://nuxt-firebase-auth.vercel.app/',
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
      <!-- Discover Music -->
      <DiscoverMusic class="animate__animated animate__zoomIn" />
      <!-- Recent Release -->
      <RecentReleases :releases="releases" />
      <!-- Last Artist Added -->
      <ArtistAdded :artists="artists" />
    </section>
  </div>
</template>
