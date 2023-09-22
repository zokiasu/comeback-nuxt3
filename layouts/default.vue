<script setup>
import 'animate.css';
import { useUserStore } from '@/stores/user'

const isPlayingVideo = useIsPlayingVideo()
const artistFetch = ref(null)
const { isLoginStore, isAdminStore } = useUserStore();

onMounted(async () => {
  artistFetch.value = await queryByCollection('artists')
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
