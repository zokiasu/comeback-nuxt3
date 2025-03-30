<script setup>
	const routeN = useRoute()
	const collapseMenu = ref(true)
	const menuCollapsable = ref(null)

	const collapseMenuToggle = () => {
		collapseMenu.value = !collapseMenu.value
	}
</script>

<template>
	<div class="flex h-screen gap-2 p-2 min-h-dvh-wo-nav max-h-dvh-wo-nav">
		<nav
			ref="menuCollapsable"
			class="flex flex-col h-full gap-2 p-2 transition-all duration-300 ease-in-out rounded bg-quaternary drop-shadow-xl"
			:class="collapseMenu ? 'w-12' : 'w-80'"
		>
			<div
				class="flex justify-between py-3 transition-all duration-300 ease-in-out rounded cursor-pointer text-zinc-500 hover:bg-quinary hover:text-white"
				:class="{
					'px-5': !collapseMenu,
					'flex-col items-center': collapseMenu,
				}"
				@click="collapseMenuToggle()"
			>
				<p v-if="!collapseMenu">Dashboard</p>
				<IconDoubleArrowLeft v-if="!collapseMenu" class="w-6 h-6" />
				<IconDoubleArrowRight v-else class="w-6 h-6" />
			</div>
			<NuxtLink
				to="/dashboard/artist"
				title="Artist"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-artist',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artist',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconArtist  class="w-4 h-4" />
				<p v-if="!collapseMenu">Artist</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/artistPending"
				title="Artist Update"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white':
						routeN.name === 'dashboard-artistPending',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-artistPending',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconArtist class="w-4 h-4" />
				<p v-if="!collapseMenu">Artist Update</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/release"
				title="Release"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-release',
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
				title="News"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-news',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-news',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconNews class="w-4 h-4" />
				<p v-if="!collapseMenu">News</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/datas"
				title="General Datas"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-datas',
					'text-zinc-500 hover:bg-quinary': routeN.name !== 'dashboard-datas',
					'px-5': !collapseMenu,
					'flex-col': collapseMenu,
				}"
			>
				<IconStyle class="w-4 h-4" />
				<p v-if="!collapseMenu">General Datas</p>
			</NuxtLink>
			<NuxtLink
				to="/dashboard/users"
				title="Users"
				class="flex items-center gap-2 py-3 transition-all duration-300 ease-in-out rounded"
				:class="{
					'bg-quinary font-semibold text-white': routeN.name === 'dashboard-users',
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
