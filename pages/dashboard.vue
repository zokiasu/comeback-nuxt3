<script setup>
	const routeN = useRoute()
	const collapseMenu = ref(true)
	const menuCollapsable = ref(null)

	const collapseMenuToggle = () => {
		collapseMenu.value = !collapseMenu.value
	}
</script>

<template>
	<div class="min-h-dvh-wo-nav max-h-dvh-wo-nav flex h-screen gap-2 p-2">
		<nav
			ref="menuCollapsable"
			class="flex h-full flex-col gap-2 rounded bg-quaternary p-2 drop-shadow-xl transition-all duration-300 ease-in-out"
			:class="collapseMenu ? 'w-12' : 'w-80'"
		>
			<div
				class="flex cursor-pointer justify-between rounded py-3 text-zinc-500 transition-all duration-300 ease-in-out hover:bg-quinary hover:text-white"
				:class="{
					'px-5': !collapseMenu,
					'flex-col items-center': collapseMenu,
				}"
				@click="collapseMenuToggle()"
			>
				<p v-if="!collapseMenu">Dashboard</p>
				<IconDoubleArrowLeft v-if="!collapseMenu" class="h-6 w-6" />
				<IconDoubleArrowRight v-else class="h-6 w-6" />
			</div>
			<NuxtLink
				to="/dashboard/artist"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-artist',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artist',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconArtist class="h-4 w-4" />
				<p v-if="!collapseMenu">Artist</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/artistPending"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-artistPending',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artistPending',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconArtist class="h-4 w-4" />
				<p v-if="!collapseMenu">Artist Update</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/release"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-release',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-release',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconRelease class="h-4 w-4" />
				<p v-if="!collapseMenu">Release</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/news"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-news',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-news',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconNews class="h-4 w-4" />
				<p v-if="!collapseMenu">News</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/datas"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-datas',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-datas',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconStyle class="h-4 w-4" />
				<p v-if="!collapseMenu">General Datas</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/users"
				class="flex items-center gap-2 rounded py-3 transition-all duration-300 ease-in-out"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-users',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-users',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconAccount class="h-4 w-4" />
				<p v-if="!collapseMenu">Users</p>
			</NuxtLink>
		</nav>
		<div class="w-full overflow-hidden">
			<NuxtPage />
		</div>
	</div>
</template>
