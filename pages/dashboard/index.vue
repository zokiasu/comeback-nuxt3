<script setup>
const routeN = useRoute()

// definePageMeta({
//   middleware: 'admin'
// })

</script>

<template>
  <div class="px-5">
    <nav class="container mx-auto flex flex-wrap items-center justify-center text-center p-3 border-b border-zinc-700 space-x-10">
      <NuxtLink to="/dashboard/artist" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-artist' ? 'text-white font-semibold' : 'text-zinc-500'">
        Artist
      </NuxtLink>
      <NuxtLink to="/dashboard/artistUpdate" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-artistUpdate' ? 'text-white font-semibold' : 'text-zinc-500'">
        Artist Update
      </NuxtLink>
      <NuxtLink to="/dashboard/release" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-release' ? 'text-white font-semibold' : 'text-zinc-500'">
        Release
      </NuxtLink>
      <NuxtLink to="/dashboard/news" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-news' ? 'text-white font-semibold' : 'text-zinc-500'">
        News
      </NuxtLink>
      <NuxtLink to="/dashboard/styles" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-styles' ? 'text-white font-semibold' : 'text-zinc-500'">
        Styles
      </NuxtLink>
      <NuxtLink to="/dashboard/users" class="transition-all duration-700 ease-in-out" :class="routeN.name === 'dashboard-index-users' ? 'text-white font-semibold' : 'text-zinc-500'">
        Users
      </NuxtLink>
    </nav>
    <NuxtPage class="container mx-auto w-full min-h-screen py-3 lg:p-3"/>
  </div>
</template>