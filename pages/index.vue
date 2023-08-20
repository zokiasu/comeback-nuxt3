<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore';

useHead({
  title: 'Comeback',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'robots', content: 'noindex,nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Don\'t miss any Comeback. Track every next release by your favorite artists.' },
    { hid: 'og:site_name', property: 'og:site_name', content: 'Comeback - Track every next release by your favorite artists.' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:title', property: 'og:title', content: 'Comeback - Track every next release by your favorite artists.' },
    { hid: 'og:description', property: 'og:description', content: 'Don\'t miss any Comeback. Track every next release by your favorite artists.' },
    { hid: 'og:url', property: 'og:url', content: 'https://nuxt-firebase-auth.vercel.app/' },
    { hid: 'og:image', property: 'og:image', content: 'https://nuxt-firebase-auth.vercel.app/ogp.png' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ]
})

const news = ref([] as Object[])
const artists = ref([] as Object[])
const releases = ref([] as Object[])

onMounted(async () => {
  const artistDate = new Date()
  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 7)
  const newsDate = new Date()
  newsDate.setDate(newsDate.getDate() - 1)
  news.value = await fetchNews(Timestamp.fromDate(newsDate))
  releases.value = await fetchReleasesWithDateAndLimit(Timestamp.fromDate(releaseDate), 8)
  artists.value = await fetchArtistsWithLimit(Timestamp.fromDate(artistDate), 8)
})
</script>

<template>
  <div>
    <section
      class="animate__animated animate__fadeInDown relative px-10 xl:px-40 w-full flex flex-col justify-center h-screen md:h-[calc(100vh-60px)] bg-cover bg-center bg-no-repeat bg-[url('https://www.blind-magazine.com/wp-content/uploads/2021/12/comment-photographier-un-concert-fr-1536x864.jpg.webp')]">
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="z-10 space-y-1.5 xl:space-y-5">
        <p class="text-[2rem] sm:text-[6vw] xl:text-7xl font-bold">
          Don't miss any <span class="text-primary">Comeback</span>
        </p>
        <p class="text-[3vw] xl:text-3xl">Track every next release by your favorite artists</p>
      </div>
      <p class="absolute bottom-20 left-0 right-0 md:hidden">
        <icon-arrow-down class="animate-bounce w-5 h-5 mx-auto" />
      </p>
    </section>
    <section v-if="news.length > 0 || releases.length > 0 || artists.length > 0" class="container mx-auto py-10">
      <div class="space-y-8">
        <ComebackReported v-if="news.length > 0" :newsT="news" class="animate__animated animate__fadeInUp" />
        <RecentReleases v-if="releases.length > 0" :releases="releases" class="animate__animated animate__fadeInUp" />
        <ArtistAdded v-if="artists.length > 0" :artists="artists" class="animate__animated animate__fadeInUp" />
      </div>
    </section>
  </div>
</template>
