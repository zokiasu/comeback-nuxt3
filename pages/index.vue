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

const news = ref([] as any[])
const artists = ref([] as any[])
const releases = ref([] as any[])

const newsFetched = ref(false)

const newsToday = computed(() => {
  return news.value.filter((news: any) => {
    const newsDate = new Date(news.date.seconds * 1000)
    const today = new Date()
    return (
      newsDate.getDate() === today.getDate() &&
      newsDate.getMonth() === today.getMonth() &&
      newsDate.getFullYear() === today.getFullYear()
    )
  })
})

onMounted(async () => {
  newsFetching()

  const artistDate = new Date()
  artists.value = await fetchArtistsWithLimit(Timestamp.fromDate(artistDate), 8)

  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() - 8)
  releases.value = await fetchReleasesWithDateAndLimit(Timestamp.fromDate(releaseDate), 8)
})

const newsFetching = () => {
  const newsDate = new Date()
  newsDate.setDate(newsDate.getDate() - 1)
  const q = query(
    collection(db as any, 'news'),
    where('date', '>=', Timestamp.fromDate(newsDate)),
    orderBy('date', 'asc'),
  )
  onSnapshot(q, (querySnapshot) => {
    const newsTmp: any[] = []
    querySnapshot.forEach((doc) => {
      newsTmp.push(doc.data())
    })
    news.value = newsTmp
    newsFetched.value = true
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
    <section v-if="newsToday.length && newsFetched">
      <div class="relative">
        <div class="absolute z-10 pt-10">
          <p
            class="w-fit bg-red-700 py-1 pl-8 pr-5 text-xs font-semibold uppercase drop-shadow-lg lg:text-xl xl:text-2xl"
          >
            Comeback Today
          </p>
        </div>

        <Swiper
          :modules="[SwiperAutoplay, SwiperParallax]"
          :slides-per-view="1"
          :loop="true"
          :parallax="true"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
        >
          <SwiperSlide
            v-for="news in newsToday"
            :key="news.id"
            class="swiper-slide relative"
          >
            <NuxtImg
              :src="news.artist.image"
              class="min-h-[20rem] w-full object-cover lg:max-h-[40rem]"
            />
            <NuxtLink
              :to="`/artist/${news.artist.id}`"
              class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/30 p-5"
            >
              <p
                class="self-center text-3xl font-bold lg:text-5xl xl:text-7xl 2xl:text-9xl"
              >
                {{ news.artist.name }}
              </p>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
    <section
      v-else-if="newsFetched && !newsToday.length"
      class="relative flex h-[calc(100vh-60px)] w-full flex-col justify-center bg-[url('https://www.blind-magazine.com/wp-content/uploads/2021/12/comment-photographier-un-concert-fr-1536x864.jpg.webp')] bg-cover bg-center bg-no-repeat text-center sm:min-h-[30rem] lg:max-h-[40rem]"
    >
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="z-10 space-y-1.5 xl:space-y-5">
        <p class="text-[2rem] font-bold sm:text-[6vw] xl:text-7xl">
          Don't miss any
          <span class="text-primary">Comeback</span>
        </p>
        <p class="text-[3vw] xl:text-3xl">
          Track every next release by your favorite artists
        </p>
      </div>
      <p class="absolute bottom-20 left-0 right-0 md:hidden">
        <icon-arrow-down class="mx-auto h-5 w-5 animate-bounce" />
      </p>
    </section>
    <section class="container mx-auto space-y-16 px-10 py-16">
      <DiscoverMusic v-if="newsFetched" class="animate__animated animate__zoomIn" />
      <ComebackReported
        v-if="news.length && newsFetched"
        :news-t="news"
        class="animate__animated animate__fadeInUp"
      />
      <RecentReleases
        v-if="releases.length"
        :releases="releases"
        class="animate__animated animate__fadeInUp"
      />
      <ArtistAdded
        v-if="artists.length"
        :artists="artists"
        class="animate__animated animate__fadeInUp"
      />
    </section>
  </div>
</template>
