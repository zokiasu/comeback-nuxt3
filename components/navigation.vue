<script setup lang="ts">
	import { useUserStore } from '@/stores/user'

	const userStore = useUserStore()
	const route = useRoute()

	const navbar = ref<HTMLElement | null>(null)
	const algolia = ref<HTMLElement | null>(null)

	const isLoginStore = computed(() => userStore.isLoginStore)
	const isAdminStore = computed(() => userStore.isAdminStore)

	onMounted(async () => {
		window.addEventListener('scroll', handleScroll)
	})

	function handleScroll() {
		if (navbar.value === null) return

		if (window.scrollY > 50) {
			navbar.value.classList.add(
				'bg-cb-secondary-950',
				'border',
				'border-zinc-700',
				'shadow',
				'shadow-zinc-700',
			)
		} else {
			navbar.value.classList.remove(
				'bg-cb-secondary-950',
				'border',
				'border-zinc-700',
				'shadow',
				'shadow-zinc-700',
			)
		}
	}
</script>

<template>
	<div
		class="sticky top-0 z-50 px-3 py-2 transition-all duration-500 ease-in-out xl:py-3"
	>
		<div
			id="navbar"
			ref="navbar"
			class="animate__animated animate__fadeInDown rounded-full px-5 transition-all duration-500 ease-in-out"
		>
			<div class="mx-auto flex justify-between py-3 2xl:container">
				<NuxtLink to="/">
					<img src="~/assets/image/logo.png" alt="Comeback" class="block h-8 w-auto" />
				</NuxtLink>

				<nav class="flex items-center justify-center gap-x-5 text-sm">
					<NuxtLink
						:to="`/`"
						:class="route.name === 'index' ? 'font-semibold text-white' : 'text-zinc-500'"
					>
						Home
					</NuxtLink>
					<NuxtLink
						:to="`/calendar`"
						:class="
							route.name === 'calendar' ? 'font-semibold text-white' : 'text-zinc-500'
						"
					>
						Calendar
					</NuxtLink>
					<NuxtLink
						v-if="isAdminStore"
						:to="`/dashboard/artist`"
						:class="
							(route.name as string)?.startsWith('dashboard-')
								? 'font-semibold text-white'
								: 'text-zinc-500'
						"
					>
						Dashboard
					</NuxtLink>
				</nav>

				<div class="flex items-center justify-center gap-x-2 text-sm">
					<UModal
						:ui="{
							overlay: 'bg-cb-quinary-950/75',
							content: 'ring-cb-quinary-950',
						}"
					>
						<UButton
							variant="soft"
							class="bg-cb-quaternary-950 hover:bg-cb-tertiary-200/20 h-full items-center justify-center text-xs text-white"
						>
							<UIcon name="material-symbols:search" class="size-4" />
						</UButton>

						<template #content>
							<LazyAlgolia ref="algolia" />
						</template>
					</UModal>

					<UModal
						:ui="{
							overlay: 'bg-cb-quinary-950/75',
							content: 'ring-cb-quinary-950',
						}"
					>
						<UButton
							label="New Comeback"
							variant="soft"
							class="bg-cb-primary-900 hover:bg-cb-primary-900/90 h-full cursor-pointer items-center justify-center rounded px-5 text-white"
						/>

						<template #content>
							<LazyModalNewsCreation />
						</template>
					</UModal>

					<UButton
						v-if="isLoginStore"
						to="/settings/profile"
						variant="soft"
						class="bg-cb-quaternary-950 hover:bg-cb-tertiary-200/20 h-full items-center justify-center text-xs text-white"
					>
						<UIcon name="material-symbols:settings-rounded" class="size-3" />
					</UButton>

					<UButton
						v-else
						to="/authentification"
						variant="soft"
						label="Login"
						class="bg-cb-quaternary-950 hover:bg-cb-tertiary-200/20 h-full items-center justify-center text-xs text-white"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
