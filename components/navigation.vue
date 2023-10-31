<script setup>
import * as Mdl from '@kouts/vue-modal'

const { artistFetch, isAdmin, isLogin } = defineProps(['artistFetch', 'isAdmin', 'isLogin'])

const { Modal } = Mdl

const routeN = useRoute()

const navbar = ref(null)
const showModal = ref(false)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (window.scrollY > 50) {
    navbar.value.classList.add('bg-secondary', 'border', 'border-zinc-700', 'shadow', 'shadow-zinc-700')
  } else {
    navbar.value.classList.remove('bg-secondary', 'border', 'border-zinc-700', 'shadow', 'shadow-zinc-700')
  }
}

const signOut = async () => {
  await signOutApp()
  const router = useRouter()
  router.push('/')
}
</script>

<template>
  <div class="sticky top-0 z-50 px-3 py-2 transition-all duration-500 ease-in-out xl:py-3">
    <div ref="navbar" class="animate__animated animate__fadeInDown rounded-full px-5 transition-all duration-500 ease-in-out">
      <div class="mx-auto flex justify-between py-3 2xl:container">
        <NuxtLink to="/">
          <img src="~/assets/image/logo.png" alt="Comeback" class="block h-8 w-auto" />
        </NuxtLink>
        <nav class="flex items-center justify-center space-x-5 text-sm">
          <NuxtLink :to="`/`" :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'">Home</NuxtLink>
          <NuxtLink :to="`/calendar`" :class="routeN.name === 'calendar' ? 'text-white' : 'text-zinc-500'">Calendar</NuxtLink>
          <NuxtLink :to="`/artist`" :class="routeN.name === 'artist' ? 'text-white' : 'text-zinc-500'">Artists</NuxtLink>
          <NuxtLink v-if="isAdmin" :to="`/dashboard/artist`" :class="routeN.name === 'dashboard-index-*' ? 'text-white' : 'text-zinc-500'">Dashboard</NuxtLink>
          <button
            v-if="isLogin && artistFetch"
            @click="showModal = true"
            class="font-bold text-primary transition-all duration-300 ease-in-out hover:scale-110 hover:text-red-500"
          >
            New Comeback
          </button>
          <NuxtLink v-if="!isLogin" :to="`/authentification`" :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'">Log In</NuxtLink>
          <button v-else @click="signOut" :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'">Log Out</button>
        </nav>
      </div>
    </div>
    <Modal
      v-model="showModal"
      title="Add a News"
      wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <NewsCreation :artistList="artistFetch" @close-modal="showModal = false" />
    </Modal>
  </div>
</template>
