<script setup>
	const routeN = useRoute()
	const menuCollapsable = ref(null)

	const signOut = async () => {
		await signOutApp()
		const router = useRouter()
		router.push('/')
	}
</script>

<template>
	<div class="min-h-dvh-wo-nav max-h-dvh-wo-nav flex h-screen gap-2 p-2">
		<nav
			ref="menuCollapsable"
			class="flex h-full w-80 flex-col gap-2 rounded bg-quaternary p-2 text-sm drop-shadow-xl transition-all duration-300 ease-in-out"
		>
			<NuxtLink
				to="/settings/profile"
				class="flex items-center gap-2 rounded px-3 py-1.5 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'settings-profile',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-profile',
				}"
			>
				<p>Profile</p>
			</NuxtLink>
			<NuxtLink
				to="/settings/general"
				class="flex items-end justify-between gap-2 rounded px-3 py-1.5 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'settings-general',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-general',
				}"
			>
				<p>General Settings</p>
				<span class="px-2 text-[10px] font-bold text-primary">Coming Soon</span>
			</NuxtLink>
			<NuxtLink
				to="/settings/security"
				class="flex items-end justify-between gap-2 rounded px-3 py-1.5 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'settings-security',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'settings-security',
				}"
			>
				<p>Security & Privacy</p>
				<span class="px-2 text-[10px] font-bold text-primary">Coming Soon</span>
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
				class="flex items-center justify-between gap-2 rounded px-3 py-1.5 text-zinc-500 transition-all duration-300 ease-in-out hover:text-white"
			>
				<p>Create Artist</p>
				<IconLinkexternal class="h-3.5 w-3.5" />
			</NuxtLink>
			<button
				class="flex items-center justify-between gap-2 rounded px-3 py-1.5 text-zinc-500 transition-all duration-300 ease-in-out hover:text-white"
				@click="signOut"
			>
				<p>Logout</p>
				<IconLogout class="h-3.5 w-3.5" />
			</button>
		</nav>
		<div class="w-full overflow-hidden">
			<NuxtPage />
		</div>
	</div>
</template>
