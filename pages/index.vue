<script setup lang="ts">
	import type { Music } from '~/types/supabase/music'
	import type { Artist } from '~/types/supabase/artist'
	import type { Release } from '~/types/supabase/release'
	import type { News } from '~/types/supabase/news'
	import { useSupabaseNews } from '~/composables/Supabase/useSupabaseNews'
	import { useSupabaseRelease } from '~/composables/Supabase/useSupabaseRelease'
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'
	import { useSupabaseMusic } from '~/composables/Supabase/useSupabaseMusic'

	const { getRealtimeLastestNewsAdded } = useSupabaseNews()
	const { getRealtimeLastestReleasesAdded } = useSupabaseRelease()
	const { getRealtimeLastestArtistsAdded } = useSupabaseArtist()
	const { getRandomMusics } = useSupabaseMusic()

	const comebacks = ref<News[]>([])
	const artists = ref<Artist[]>([])
	const releases = ref<Release[]>([])
	const musics = ref<Music[]>([])

	const comebacksToday = computed<News[]>(() => {
		return comebacks.value.filter((comeback) => {
			const comebacksDate = new Date(comeback.date)
			const today = new Date()
			return (
				comebacksDate.getDate() === today.getDate() &&
				comebacksDate.getMonth() === today.getMonth() &&
				comebacksDate.getFullYear() === today.getFullYear()
			)
		})
	})

	onMounted(async () => {
		musics.value = await getRandomMusics(4)
		console.log(musics.value)

		Promise.all([
			new Promise<void>((resolve) =>
				getRealtimeLastestNewsAdded((news: News[]) => {
					comebacks.value = news
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestReleasesAdded(8, (rel: Release[]) => {
					releases.value = rel
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestArtistsAdded(8, (art: Artist[]) => {
					artists.value = art
					resolve()
				}),
			),
		])
	})

	const reloadDiscoverMusic = async () => {
		musics.value = await getRandomMusics(4)
	}
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
						<LazyDiscoverMusic v-for="music in musics" :key="music.id" :music="music" />
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
