<script setup>
const routeN = useRoute()

const navbar = ref(null)
const showModal = ref(false)
const artistFetch = ref(null)

const user = ref(null)
const userData = ref(null)
const userRole = ref(null)
const isLogin = ref(null)

onMounted(async () => {
  artistFetch.value = await fetchArtists()
  window.addEventListener('scroll', handleScroll)

  isLogin.value = useUser().isLogin.value
  console.log('isLogin', isLogin.value)

  user.value = useUser().firebaseUser.value
  console.log('user', user.value)

  userData.value = await useUser().getDatabaseUser()
  console.log('userData', userData.value)

  userRole.value = userData.value.role
})

// watch
watch(() => useUser().isLogin.value, (value) => {
  isLogin.value = value
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
  <div class="sticky top-0 py-2 px-3 xl:py-3 z-50 transition-all duration-500 ease-in-out">
    <div ref="navbar"
      class="animate__animated animate__fadeInDown px-5 rounded-full transition-all duration-500 ease-in-out">
      <div class="mx-auto flex justify-between py-3 2xl:container">
        <NuxtLink to="/">
          <img src="~/assets/image/logo.png" alt="Comeback" class="block h-8 w-auto" />
        </NuxtLink>
        <nav class="flex items-center justify-center text-sm space-x-5">
          <NuxtLink :to="`/`" :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'">
            Home
          </NuxtLink>
          <NuxtLink :to="`/calendar`" :class="routeN.name === 'calendar' ? 'text-white' : 'text-zinc-500'">
            Calendrier
          </NuxtLink>
          <NuxtLink :to="`/artist`" :class="routeN.name === 'artist' ? 'text-white' : 'text-zinc-500'">
            Artists
          </NuxtLink>
          <NuxtLink v-if="isLogin && userRole == 'ADMIN'" :to="`/dashboard/artist`" :class="routeN.name === 'dashboard-index-*' ? 'text-white' : 'text-zinc-500'">
            Dashboard
          </NuxtLink>
          <button v-if="isLogin" @click="showModal = true"
            class="text-primary font-bold hover:text-red-500 hover:scale-110 transition-all ease-in-out duration-300">
            New Comeback
          </button>
          <NuxtLink v-if="!isLogin" :to="`/authentification`" :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'">
            Log In
          </NuxtLink>
          <button v-else @click="signOut" :class="routeN.name === 'authentification' ? 'text-white' : 'text-zinc-500'">
            Log Out
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>