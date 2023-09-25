<script setup lang="ts">
import 'animate.css';
import { useUserStore } from '@/stores/user'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const { $firestore: db } = useNuxtApp();
const userStore = useUserStore();
const isAdminStore = computed(() => userStore.isAdminStore)
const isLoginStore = computed(() => userStore.isLoginStore)
const isPlayingVideo = useIsPlayingVideo()
const artistFetch = ref([] as any[])

onMounted(async () => {
  const q = query(collection(db as any, 'artists'), orderBy('name', 'asc'));
  onSnapshot(q, (querySnapshot) => {
    const tmp: any[] = [];
    querySnapshot.forEach((doc) => {
      tmp.push(doc.data());
    });
    artistFetch.value = tmp
  });
})
</script>

<template>
  <div class="bg-secondary text-tertiary min-h-screen">
    <Navigation class="hidden md:block" :artistFetch="artistFetch" :isAdmin="isAdminStore" :isLogin="isLoginStore" />
    <div class="z-50 pt-5 pb-4 inset-x-0 md:hidden">
      <img src="~/assets/image/logo.png" alt="Comeback" quality="80" loading="lazy" class="block h-9 w-auto mx-auto"/>
    </div>
    <main class="min-h-[calc(100vh-60px)]">
      <slot />
    </main>
    <LazyFooter />
    <LazyMobileNavigation class="md:hidden" :artistFetch="artistFetch" :isAdmin="isAdminStore" :isLogin="isLoginStore" />
    <LazyYoutubePlayer ref="YTPlayer" v-if="isPlayingVideo" class="fixed bottom-0 animate__animated animate__fadeInUp" />
  </div>
</template>
