<script setup lang="ts">
	import 'animate.css'

	const isPlayingVideo = useIsPlayingVideo()
	const route = useRoute()

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
	<div class="min-h-screen flex flex-col w-full bg-secondary text-tertiary">
		<Navigation class="hidden md:block" />
		<div class="inset-x-0 z-50 py-3 md:hidden">
			<img
				src="~/assets/image/logo.png"
				alt="Comeback"
				quality="80"
				loading="lazy"
				class="mx-auto block h-8 w-auto"
			/>
		</div>
		<main class="flex-1 flex flex-col">
			<slot />
		</main>
		<LazyFooter v-if="displayingFooter" />
		<LazyMobileNavigation class="md:hidden" />
		<LazyYoutubePlayer
			v-if="isPlayingVideo"
			ref="YTPlayer"
			class="animate__animated animate__fadeInUp fixed bottom-0"
		/>
	</div>
</template>
