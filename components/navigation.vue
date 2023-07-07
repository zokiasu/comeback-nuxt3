<script setup>
const route = ref()
route.value = useRoute()
const routeName = route.value.name
console.log(routeName)
</script>

<template>
  <div class="p-5 mx-auto fixed top-0 inset-x-0">
    <div
      class="container bg-secondary mx-auto flex borde shadow-quinary shadow-lg border-quinary border justify-between p-5 rounded-lg">
      <img class="block h-8 w-auto" src="~/assets/image/logo.png" alt="Comeback" />
      <nav class="flex items-center justify-center space-x-5">
        <NuxtLink :to="`/`" :class="routeName == 'index' ? 'text-white' : 'text-zinc-500'">
          Home
        </NuxtLink>
        <NuxtLink :to="`/`" :class="routeName == 'calendar' ? 'text-white' : 'text-zinc-500'">
          Calendrier
        </NuxtLink>
        <NuxtLink :to="`/`" :class="routeName == 'artist' ? 'text-white' : 'text-zinc-500'">
          Artists
        </NuxtLink>
        <NuxtLink :to="`/`" :class="routeName == 'dashboard' ? 'text-white' : 'text-zinc-500'">
          Dashboard
        </NuxtLink>
        <button class="text-primary font-bold hover:text-red-500 hover:scale-110 transition-all ease-in-out duration-300">
          New Comeback
        </button>
      </nav>
    </div>
  </div>
</template>