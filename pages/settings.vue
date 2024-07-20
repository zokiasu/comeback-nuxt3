<script setup>
const routeN = useRoute();
const collapseMenu = ref(true);
const menuCollapsable = ref(null);

const collapseMenuToggle = () => {
  collapseMenu.value = !collapseMenu.value;
};

const signOut = async () => {
  await signOutApp()
  const router = useRouter()
  router.push('/')
}
</script>

<template>
  <div class="h-screen min-h-dvh-wo-nav max-h-dvh-wo-nav p-2 gap-2 flex">
    <nav
      ref="menuCollapsable"
      class="bg-quaternary h-full flex flex-col rounded p-2 gap-2 drop-shadow-xl transition-all ease-in-out duration-300 text-sm w-80"
    >
      <NuxtLink
        to="/settings/profile"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'settings-profile',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-profile',
        }"
      >
        <p>Profile</p>
      </NuxtLink>
      <NuxtLink
        to="/settings/general"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'settings-general',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-general',
        }"
      >
        <p>General Settings</p>
      </NuxtLink>
      <NuxtLink
        to="/settings/security"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'settings-security',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-security',
        }"
      >
        <p>Security & Privacy</p>
      </NuxtLink>
      <!-- <NuxtLink
        to="/settings/notification"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'settings-notification',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-notification',
        }"
      >
        <p>Notifications</p>
      </NuxtLink> -->
      <!-- <NuxtLink
        to="/settings/subscription"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex items-center gap-2"
        :class="{
          'font-semibold text-white bg-quinary': routeN.name === 'settings-subscription',
          'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-subscription',
        }"
      >
        <p>Subscriptions</p>
      </NuxtLink> -->
      <div class="border-b border-quinary"></div>
      <NuxtLink
        :to="`/artist/create`"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex justify-between items-center gap-2 text-zinc-500 hover:text-white"
      >
        <p>Create Artist</p>
        <IconLinkexternal class="w-3.5 h-3.5" />
      </NuxtLink>
      <button
        @click="signOut"
        class="transition-all duration-300 px-3 py-1.5 ease-in-out rounded flex justify-between items-center gap-2 text-zinc-500 hover:text-white"
      >
        <p>Logout</p>
        <IconLogout class="w-3.5 h-3.5" />
      </button>
    </nav>
    <div class="w-full overflow-hidden">
      <NuxtPage />
    </div>
  </div>
</template>
