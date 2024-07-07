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
const route = useRoute()

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

const displayingFooter = computed(() => {
  return (
    route &&
    route.name &&
    typeof route.name === 'string' &&
    !route.name.startsWith('dashboard-') &&
    !route.name.startsWith('settings-') &&
    !route.name.startsWith('syncradio')
  )
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
    <div class="inset-x-0 z-50 py-3 md:hidden">
      <img
        src="~/assets/image/logo.png"
        alt="Comeback"
        quality="80"
        loading="lazy"
        class="mx-auto block h-8 w-auto"
      />
    </div>
    <main>
      <slot />
    </main>
    <LazyFooter v-if="displayingFooter" />
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
