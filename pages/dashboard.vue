<script setup>
const routeN = useRoute()
</script>

<template>
  <div class="px-5">
    <nav class="container mx-auto flex flex-wrap items-center justify-center space-x-10 border-b border-zinc-700 p-3 text-center">
      <NuxtLink
        to="/dashboard/artist"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-artist' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        Artist
      </NuxtLink>
      <NuxtLink
        to="/dashboard/artistUpdate"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-artistUpdate' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        Artist Update
      </NuxtLink>
      <NuxtLink
        to="/dashboard/release"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-release' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        Release
      </NuxtLink>
      <NuxtLink
        to="/dashboard/news"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-news' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        News
      </NuxtLink>
      <NuxtLink
        to="/dashboard/styles"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-styles' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        Styles
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users"
        class="transition-all duration-300 ease-in-out"
        :class="routeN.name === 'dashboard-users' ? 'font-semibold text-white' : 'text-zinc-500'"
      >
        Users
      </NuxtLink>
    </nav>
    <NuxtPage class="container mx-auto min-h-screen w-full py-3 lg:p-3" />
  </div>
</template>
