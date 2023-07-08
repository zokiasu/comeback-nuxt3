<script setup>
import { Modal } from '@kouts/vue-modal'
const routeN = useRoute()
const navbar = ref(null)
const showModal = ref(false)

function handleScroll() {
  console.log('nav', navbar.value)
  if (window.scrollY > 50) {
    navbar.value.classList.add('bg-secondary')
  } else {
    navbar.value.classList.remove('bg-secondary')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

</script>

<template>
  <div>
    <div ref="navbar"
      class="animate__animated animate__fadeInDown sticky top-0 w-full z-50 transition-all duration-500 ease-in-out hidden md:block">
      <div class="mx-auto flex justify-between p-5">
        <img class="block h-8 w-auto" src="~/assets/image/logo.png" alt="Comeback" />
        <nav class="flex items-center justify-center space-x-5">
          <NuxtLink :to="`/`" :class="routeN.name === 'index' ? 'text-white' : 'text-zinc-500'">
            Home
          </NuxtLink>
          <NuxtLink :to="`/calendar`" :class="routeN.name === 'calendar' ? 'text-white' : 'text-zinc-500'">
            Calendrier
          </NuxtLink>
          <NuxtLink :to="`/artist`" :class="routeN.name === 'artist' ? 'text-white' : 'text-zinc-500'">
            Artists
          </NuxtLink>
          <NuxtLink :to="`/dashboard`" :class="routeN.name === 'dashboard' ? 'text-white' : 'text-zinc-500'">
            Dashboard
          </NuxtLink>
          <button @click="showModal = true"
            class="text-primary font-bold hover:text-red-500 hover:scale-110 transition-all ease-in-out duration-300">
            New Comeback
          </button>
        </nav>
      </div>
    </div>
    <Modal v-model="showModal" title="Add a News" wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`" :out-class="`animate__bounceOut`" bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`" :bg-out-class="`animate__fadeOutDown`">
      <p>Modal content goes here...</p>
    </Modal>
  </div>
</template>