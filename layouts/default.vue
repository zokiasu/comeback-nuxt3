<script setup lang="ts">
	import 'animate.css'
	import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
	import { useUserStore } from '@/stores/user'

	const { $firestore: db } = useNuxtApp()
	const userStore = useUserStore()
	const isAdminStore = computed(() => userStore.isAdminStore)
	const isLoginStore = computed(() => userStore.isLoginStore)
	const isPlayingVideo = useIsPlayingVideo()
	const artistFetch = ref([] as any[])
	const route = useRoute()

	onMounted(async () => {
		const q = query(collection(db as any, 'artists'), orderBy('name', 'asc'))
		onSnapshot(q, (querySnapshot) => {
			const tmp: any[] = []
			querySnapshot.forEach((doc) => {
				tmp.push(doc.data())
			})
			artistFetch.value = tmp
		})
	})

	const displayingFooter = computed(() => {
		return (
			route &&
			route.name &&
			typeof route.name === 'string' &&
			!route.name.startsWith('dashboard-') &&
			!route.name.startsWith('settings-') &&
			!route.name.startsWith('syncradio')
		)
	})
</script>

<template>
	<div class="min-h-screen bg-secondary text-tertiary">
		<Navigation
			class="hidden md:block"
			:artist-fetch="artistFetch"
			:is-admin="isAdminStore"
			:is-login="isLoginStore"
		/>
		<div class="inset-x-0 z-50 py-3 md:hidden">
			<img
				src="~/assets/image/logo.png"
				alt="Comeback"
				quality="80"
				loading="lazy"
				class="mx-auto block h-8 w-auto"
			/>
		</div>
		<slot />
		<LazyFooter v-if="displayingFooter" />
		<LazyMobileNavigation
			class="md:hidden"
			:artist-fetch="artistFetch"
			:is-admin="isAdminStore"
			:is-login="isLoginStore"
		/>
		<LazyYoutubePlayer
			v-if="isPlayingVideo"
			ref="YTPlayer"
			class="animate__animated animate__fadeInUp fixed bottom-0"
		/>
	</div>
</template>
