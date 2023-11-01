<script setup lang="ts">
import 'animate.css'
import { useUserStore } from '@/stores/user'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const { $firestore: db } = useNuxtApp()
const userStore = useUserStore()
const isAdminStore = computed(() => userStore.isAdminStore)
const isLoginStore = computed(() => userStore.isLoginStore)
const isPlayingVideo = useIsPlayingVideo()
const artistFetch = ref([] as any[])

onMounted(async () => {
  const q = query(collection(db as any, 'artists'), orderBy('name', 'asc'))
  onSnapshot(q, (querySnapshot) => {
    const tmp: any[] = []
    querySnapshot.forEach((doc) => {
      tmp.push(doc.data())
    })
    artistFetch.value = tmp
  })
})
</script>

<template>
  <div class="min-h-screen bg-secondary text-tertiary">
    <Navigation
      class="hidden md:block"
      :artistFetch="artistFetch"
      :isAdmin="isAdminStore"
      :isLogin="isLoginStore"
    />
    <div class="inset-x-0 z-50 pb-4 pt-5 md:hidden">
      <img
        src="~/assets/image/logo.png"
        alt="Comeback"
        quality="80"
        loading="lazy"
        class="mx-auto block h-9 w-auto"
      />
    </div>
    <main class="min-h-[calc(100vh-60px)]">
      <slot />
    </main>
    <LazyFooter />
    <LazyMobileNavigation
      class="md:hidden"
      :artistFetch="artistFetch"
      :isAdmin="isAdminStore"
      :isLogin="isLoginStore"
    />
    <LazyYoutubePlayer
      ref="YTPlayer"
      v-if="isPlayingVideo"
      class="animate__animated animate__fadeInUp fixed bottom-0"
    />
  </div>
</template>
