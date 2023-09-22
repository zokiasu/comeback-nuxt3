<script setup lang="ts">
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

const news = ref([] as any[])
const newsToday = ref([] as any[])

onMounted(async () => {
  const newsDate = new Date()
  newsDate.setDate(newsDate.getDate() - 1)
  news.value = await fetchNews(Timestamp.fromDate(newsDate))
  
  newsToday.value = news.value.filter((news) => {
    const newsDates = new Date(news.date.seconds * 1000)
    const today = new Date()
    return newsDates.getDate() === today.getDate() && newsDates.getMonth() === today.getMonth() && newsDates.getFullYear() === today.getFullYear()
  })
})
</script>

<template>
  <div>
    <section v-if="newsToday.length > 1" class="animate__animated animate__fadeInDown">
      <div class="relative">
        <div class="absolute z-10 pt-10">
          <p class="bg-red-700 drop-shadow-lg w-fit text-xs pr-5 pl-8 py-1 lg:text-xl xl:text-2xl font-semibold uppercase">
            Comeback Today
          </p>
        </div>
        <swiper-container centered-slides="true" autoplay-delay="2500" autoplay-disable-on-interaction="false" loop="true">
          <swiper-slide
            v-for="news in newsToday"
            :key="news.id"
            class="relative"
          >
            <NuxtImg 
              :src="news.artist.image"
              class="min-h-[20rem] lg:max-h-[40rem] w-full object-cover"
            />
            <NuxtLink :to="`/artist/${news.artist.id}`" class="absolute z-50 flex flex-col items-center justify-center inset-0 p-5 bg-secondary/30">
              <p class="self-center text-3xl lg:text-5xl xl:text-7xl 2xl:text-9xl font-bold">
                {{ news.artist.name }}
              </p>
            </NuxtLink>
          </swiper-slide>
        </swiper-container>
      </div>
    </section>
    <section class="container mx-auto max-w-7xl px-10 py-16 space-y-16">
      <DiscoverMusic class="animate__animated animate__fadeInDown" />
      <ComebackReported v-if="news" :news-t="news" class="animate__animated animate__fadeInUp" />
      <RecentReleases class="animate__animated animate__fadeInUp" />
      <ArtistAdded class="animate__animated animate__fadeInUp" />
    </section>
  </div>
</template>
