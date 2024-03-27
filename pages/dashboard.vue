<script setup>
  const routeN = useRoute()
  const collapseMenu = ref(true)
  const menuCollapsable = ref(null)

  const collapseMenuToggle = () => {
    collapseMenu.value = !collapseMenu.value
  }
</script>

<template>
  <div class="h-screen min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-2 gap-2 flex">
    <nav @click="collapseMenuToggle()" ref="menuCollapsable" class="bg-quaternary h-full flex flex-col w-80 rounded p-2 gap-2 drop-shadow-xl transition-all ease-in-out duration-300" :class="collapseMenu ? 'w-12' : 'w-80'">
      <div class="flex justify-between cursor-pointer transition-all duration-300 py-3 ease-in-out rounded text-zinc-500 hover:bg-quinary hover:text-white"
        :class="{
          'px-5': !collapseMenu,
          'flex-col items-center': collapseMenu,
        }"
      >
        <p v-if="!collapseMenu">
          Dashboard
        </p>
        <IconDoubleArrowLeft v-if="!collapseMenu" class="w-6 h-6" />
        <IconDoubleArrowRight v-else class="w-6 h-6" />
      </div>
      <NuxtLink
        to="/dashboard/artist"
        class="transition-all duration-300 py-3 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-artist',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artist',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconArtist class="w-4 h-4" />
        <p v-if="!collapseMenu">Artist</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/artistUpdate"
        class="transition-all duration-300 ease-in-out py-3 rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-artistUpdate',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artistUpdate',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconArtist class="w-4 h-4" />
        <p v-if="!collapseMenu">Artist Update</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/release"
        class="transition-all duration-300 ease-in-out py-3 rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-release',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-release',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconRelease class="w-4 h-4" />
        <p v-if="!collapseMenu">Release</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/news"
        class="transition-all duration-300 ease-in-out py-3 rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-news',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-news',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconNews class="w-4 h-4" />
        <p v-if="!collapseMenu">News</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/styles"
        class="transition-all duration-300 ease-in-out py-3 rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-styles',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-styles',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconStyle class="w-4 h-4" />
        <p v-if="!collapseMenu">Styles</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users"
        class="transition-all duration-300 ease-in-out py-3 rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'dashboard-users',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-users',
          'px-5': !collapseMenu,
          'flex-col': collapseMenu,
        }"
      >
        <IconAccount class="w-4 h-4" />
        <p v-if="!collapseMenu">Users</p>
      </NuxtLink>
    </nav>
    <div class="w-full overflow-hidden">
      <NuxtPage />
    </div>
  </div>
</template>
