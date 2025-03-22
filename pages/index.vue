<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { Timestamp } from 'firebase/firestore'
	import { useFirebaseFunction } from '~/composables/Firebase/useFirebaseFunction'
	import DiscoverMusic from '~/components/DiscoverMusic.vue'
	import type { Artist } from '~/types/artist'
	import type { Comeback } from '~/types/comeback'
	import type { Release } from '~/types/release'

	const {
		getRealtimeNextComebacks,
		getRealtimeLastestReleases,
		getRealtimeLastestArtistsAdded,
	} = useFirebaseFunction()

	const comebacks = ref<Comeback[]>([])
	const artists = ref<Artist[]>([])
	const releases = ref<Release[]>([])

	const discoverOne = ref<InstanceType<typeof DiscoverMusic> | null>(null)
	const discoverTwo = ref<InstanceType<typeof DiscoverMusic> | null>(null)
	const discoverThree = ref<InstanceType<typeof DiscoverMusic> | null>(null)
	const discoverFour = ref<InstanceType<typeof DiscoverMusic> | null>(null)

	const comebacksToday = computed<Comeback[]>(() => {
		return comebacks.value.filter((comeback) => {
			const comebacksDate = new Date(comeback.date.seconds * 1000)
			const today = new Date()
			return (
				comebacksDate.getDate() === today.getDate() &&
				comebacksDate.getMonth() === today.getMonth() &&
				comebacksDate.getFullYear() === today.getFullYear()
			)
		})
	})

	onMounted(() => {
		const comebacksDate = new Date()
		comebacksDate.setDate(comebacksDate.getDate() - 1)

		const releaseDate = new Date()
		releaseDate.setDate(releaseDate.getDate() - 8)

		Promise.all([
			new Promise<void>((resolve) =>
				getRealtimeNextComebacks(Timestamp.fromDate(comebacksDate), (cb: any) => {
					comebacks.value = cb
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestReleases(Timestamp.fromDate(releaseDate), 8, (rel: any) => {
					releases.value = rel
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestArtistsAdded(8, (art: any) => {
					artists.value = art
					resolve()
				}),
			),
		])
	})

	const reloadDiscoverMusic = async () => {
		discoverOne.value?.reloadRandomMusic()
		discoverTwo.value?.reloadRandomMusic()
		discoverThree.value?.reloadRandomMusic()
		discoverFour.value?.reloadRandomMusic()
	}

	useHead({
		title: 'Comeback',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'robots',
				content: 'noindex,nofollow',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content:
					"Don't miss any Comeback. Track every next release by your favorite artists.",
			},
			{
				hid: 'og:site_name',
				property: 'og:site_name',
				content: 'Comeback - Track every next release by your favorite artists.',
			},
			{
				hid: 'og:type',
				property: 'og:type',
				content: 'website',
			},
			{
				hid: 'og:title',
				property: 'og:title',
				content: 'Comeback - Track every next release by your favorite artists.',
			},
			{
				hid: 'og:description',
				property: 'og:description',
				content:
					"Don't miss any Comeback. Track every next release by your favorite artists.",
			},
			{
				hid: 'og:url',
				property: 'og:url',
				content: 'https://come-back.netlify.app/',
			},
			{
				hid: 'og:image',
				property: 'og:image',
				content: 'https://nuxt-firebase-auth.vercel.app/ogp.png',
			},
		],
		link: [
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: '/favicon.ico',
			},
		],
	})
</script>

<template>
	<div>
		<!-- Home Header -->
		<HomeSlider :news-today="comebacksToday" />
		<!-- Home Body -->
		<section class="container mx-auto space-y-16 p-5 py-10 2xl:space-y-20">
			<!-- Comeback Reported List -->
			<ComebackReported :comeback-list="comebacks" />
			<!-- Discover Music -->
			<div class="space-y-8 text-center xl:space-y-10">
				<p class="text-xl font-bold lg:text-4xl">Discover Music</p>
				<div class="space-y-5">
					<div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
						<LazyDiscoverMusic ref="discoverOne" :year="new Date().getFullYear()" />
						<LazyDiscoverMusic ref="discoverTwo" :year="new Date().getFullYear() - 1" />
						<LazyDiscoverMusic ref="discoverThree" :year="new Date().getFullYear() - 2" />
						<LazyDiscoverMusic ref="discoverFour" :year="new Date().getFullYear() - 3" />
					</div>
					<button class="rounded bg-quaternary px-3 py-1" @click="reloadDiscoverMusic">
						Reload
					</button>
				</div>
			</div>
			<!-- Recent Release -->
			<LazyRecentReleases :releases="releases" />
			<!-- Last Artist Added -->
			<LazyArtistAdded :artists="artists" />
		</section>
	</div>
</template>
