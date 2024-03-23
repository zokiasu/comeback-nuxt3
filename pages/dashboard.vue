<script setup>
const routeN = useRoute()
</script>

<template>
  <div class="h-screen min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-2 flex">
    <nav class="bg-quaternary h-full flex flex-col w-80 rounded p-3 drop-shadow-xl">
      <NuxtLink
        to="/dashboard/artist"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-artist'
            ? 'font-semibold text-white bg-quinary'
            : 'text-zinc-500'
        "
      >
        Artist
      </NuxtLink>
      <NuxtLink
        to="/dashboard/artistUpdate"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-artistUpdate'
            ? 'font-semibold text-white bg-quinary'
            : 'text-zinc-500'
        "
      >
        Artist Update
      </NuxtLink>
      <NuxtLink
        to="/dashboard/release"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-release'
            ? 'font-semibold text-white bg-quinary'
            : 'text-zinc-500'
        "
      >
        Release
      </NuxtLink>
      <NuxtLink
        to="/dashboard/news"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-news' ? 'font-semibold text-white bg-quinary' : 'text-zinc-500'
        "
      >
        News
      </NuxtLink>
      <NuxtLink
        to="/dashboard/styles"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-styles'
            ? 'font-semibold text-white bg-quinary'
            : 'text-zinc-500'
        "
      >
        Styles
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users"
        class="transition-all duration-300 ease-in-out px-5 py-3 rounded"
        :class="
          routeN.name === 'dashboard-users' ? 'font-semibold text-white bg-quinary' : 'text-zinc-500'
        "
      >
        Users
      </NuxtLink>
    </nav>
    <div class="w-full h-full overflow-y-scroll px-2 scrollBarLight">
      <NuxtPage />
    </div>
  </div>
</template>
