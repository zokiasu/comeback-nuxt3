<script setup lang="ts">
import { ref, computed } from 'vue';
import { Timestamp } from 'firebase/firestore';
import { useFirebaseFunction } from '@/composables/useFirebaseFunction';

const {
  getNextComebacks,
  getLatestReleases,
  getLatestArtistsAdded,
  getRandomMusic,
} = useFirebaseFunction();

// Définir les dates pour la récupération des données
const comebacksDate = new Date();
comebacksDate.setDate(comebacksDate.getDate() - 1);

const releaseDate = new Date();
releaseDate.setDate(releaseDate.getDate() - 8);

// Récupérer les comebacks avec useAsyncData pour le SSR
const { data: comebacks } = await useAsyncData('comebacks', () =>
  getNextComebacks(Timestamp.fromDate(comebacksDate))
);

// Récupérer les releases avec useAsyncData pour le SSR
const { data: releases } = await useAsyncData('releases', () =>
  getLatestReleases(Timestamp.fromDate(releaseDate), 8)
);

// Récupérer les artistes avec useAsyncData pour le SSR
const { data: artists } = await useAsyncData('artists', () =>
  getLatestArtistsAdded(8)
);

// Calculer les comebacks d'aujourd'hui
const comebacksToday = computed(() => {
  if (!comebacks.value) return [];
  return comebacks.value.filter((comeback: any) => {
    const comebacksDate = new Date(comeback.date.seconds * 1000);
    const today = new Date();
    return (
      comebacksDate.getDate() === today.getDate() &&
      comebacksDate.getMonth() === today.getMonth() &&
      comebacksDate.getFullYear() === today.getFullYear()
    );
  });
});

// Initialiser la liste de musiques aléatoires
const randomMusicList = ref<any[]>([]);

// Fonction pour recharger la musique aléatoire (côté client)
const fetchRandomMusicList = async () => {
  randomMusicList.value = await getRandomMusic();
};

// Charger la musique aléatoire après le montage du composant (côté client)
if (process.client) {
  await fetchRandomMusicList();
}

// Fonction pour recharger la section "Discover Music"
const reloadDiscoverMusic = async () => {
  await fetchRandomMusicList();
};

// Meta tags et configuration du head
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
});
</script>

<template>
  <div>
    <!-- Home Header -->
    <HomeSlider :news-today="comebacksToday" />

    <!-- Home Body -->
    <section class="container p-5 py-10 mx-auto space-y-16 2xl:space-y-20">
      <!-- Comeback Reported List -->
      <ComebackReported :comebackList="comebacks" />

      <!-- Discover Music -->
      <div class="space-y-8 text-center xl:space-y-10">
        <p class="text-xl font-bold lg:text-4xl">Discover Music</p>
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
            <!-- Afficher les musiques aléatoires -->
            <LazyDiscoverMusic
              v-for="(music, index) in randomMusicList"
              :key="index"
              :music="music"
            />
          </div>
          <button @click="reloadDiscoverMusic" class="px-3 py-1 rounded bg-quaternary">
            Reload
          </button>
        </div>
      </div>

      <!-- Recent Release -->
      <LazyRecentReleases :releases="releases" />

      <!-- Last Artist Added -->
      <LazyArtistAdded :artists="artists" />
    </section>
  </div>
</template>
