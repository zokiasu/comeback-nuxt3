<script setup lang="ts">
	import * as Mdl from '@kouts/vue-modal'
	import type { PropType } from 'vue'
	import { useUserStore } from '@/stores/user'
	import type { Artist } from '~/types/artist'

	const { Modal } = Mdl

	const userStore = useUserStore()
	const userDataStore = computed(() => userStore.userDataStore)
	const isLoginStore = computed(() => userStore.isLoginStore)

	const props = defineProps({
		artistFetch: {
			type: Array as PropType<Artist[]>,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
		isLogin: {
			type: Boolean,
			required: true,
		},
	})

	const route = useRoute()

	const navbar = ref(null)
	const algolia = ref(null)
	const showModal = ref(false)
	const showModalAlgolia = ref(false)

	function handleScroll() {
		if (navbar.value === null) return

		if (window.scrollY > 50) {
			navbar.value.classList.add(
				'bg-secondary',
				'border',
				'border-zinc-700',
				'shadow',
				'shadow-zinc-700',
			)
		} else {
			navbar.value.classList.remove(
				'bg-secondary',
				'border',
				'border-zinc-700',
				'shadow',
				'shadow-zinc-700',
			)
		}
	}

	const profilePath = computed(() => {
		if (!userDataStore.value || !userDataStore.value.id) {
			return '/settings/profile'
		}
		return `/profile/${userDataStore.value.id}`
	})

	onMounted(async () => {
		window.addEventListener('scroll', handleScroll)
	})
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
						:to="`/syncradio`"
						class="relative"
						:class="
							route.name.startsWith('syncradio')
								? 'font-semibold text-white'
								: 'text-zinc-500'
						"
					>
						SyncRadio
						<span class="absolute -bottom-2 -right-4 px-2 text-xs font-bold text-primary">
							Beta
						</span>
					</NuxtLink>
					<NuxtLink
						v-if="props.isAdmin === true"
						:to="`/dashboard/artist`"
						:class="
							route.name.startsWith('dashboard-')
								? 'font-semibold text-white'
								: 'text-zinc-500'
						"
					>
						Dashboard
					</NuxtLink>
				</nav>

				<div class="flex items-center justify-center gap-x-2 text-sm">
					<button
						title="Search Artist"
						class="rounded bg-quaternary p-2 hover:bg-tertiary/20"
						@click="showModalAlgolia = true"
					>
						<IconSearch class="h-3.5 w-3.5" />
					</button>
					<button
						v-if="isLoginStore && props.artistFetch"
						title="Add new comeback"
						class="rounded bg-primary px-3 py-1 font-semibold transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/50"
						@click="showModal = true"
					>
						New Comeback
					</button>
					<NuxtLink
						v-if="!isLoginStore"
						:to="`/authentification`"
						class="rounded bg-quaternary px-3 py-1 text-[0.875rem]"
					>
						Login
					</NuxtLink>
					<NuxtLink
						v-if="isLoginStore && userDataStore"
						:to="profilePath"
						title="Profile"
						class="flex h-full items-center gap-2 rounded bg-quaternary px-3 py-1 hover:bg-tertiary/20"
					>
						<p v-if="userDataStore" class="">Hi, {{ userDataStore.name }}</p>
					</NuxtLink>
					<NuxtLink
						v-if="isLoginStore"
						:to="`/settings/profile`"
						title="Settings"
						class="flex h-full items-center gap-2 rounded bg-quaternary px-3 py-1 hover:bg-tertiary/20"
					>
						<IconSettings class="h-3.5 w-3.5" />
					</NuxtLink>
				</div>
			</div>
		</div>
		<Modal
			v-model="showModal"
			title="Add a News"
			wrapper-class="animate__animated modal-wrapper"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__fadeInDown`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalNewsCreation
				:artist-list="props.artistFetch"
				@close-modal="showModal = false"
			/>
		</Modal>
		<Modal
			v-model="showModalAlgolia"
			title="Search Artist"
			wrapper-class="modal-wrapper"
			:modal-class="`modal-lg`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__bounceIn`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<Algolia ref="algolia" @close-modal="showModalAlgolia = false" />
		</Modal>
	</div>
</template>
