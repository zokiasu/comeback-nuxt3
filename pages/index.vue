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

	const newsFetching = ref<boolean>(true)
	const releasesFetching = ref<boolean>(true)
	const artistsFetching = ref<boolean>(true)
	const musicsFetching = ref<boolean>(true)

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
		Promise.all([
			new Promise<void>((resolve) =>
				getRealtimeLastestNewsAdded((news: News[]) => {
					comebacks.value = news
					newsFetching.value = false
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestReleasesAdded(8, (rel: Release[]) => {
					releases.value = rel.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
					releasesFetching.value = false
					resolve()
				}),
			),
			new Promise<void>((resolve) =>
				getRealtimeLastestArtistsAdded(8, (art: Artist[]) => {
					artists.value = art.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
					artistsFetching.value = false
					resolve()
				}),
			),
			new Promise<void>((resolve) => {
				getRandomMusics(4).then((musicList) => {
					musics.value = musicList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
					musicsFetching.value = false
					resolve()
				})
			}),
		])
	})

	const reloadDiscoverMusic = async () => {
		musics.value = await getRandomMusics(4)
	}
</script>

<template>
	<div class="flex-1">
		<!-- Home Header -->
		<HomeSlider :news-today="comebacksToday" />
		<!-- Home Body -->
		<section class="container p-5 py-10 mx-auto space-y-16 2xl:space-y-20">
			<!-- Comeback Reported List -->
			<ComebackReported v-if="comebacks.length > 0 && !newsFetching" :comeback-list="comebacks" />
			<div v-else-if="newsFetching" class="grid grid-cols-2 gap-5 xl:grid-cols-3">
				<SkeletonDefault class="w-full h-16 rounded-lg" />
				<SkeletonDefault class="w-full h-16 rounded-lg" />
				<SkeletonDefault class="w-full h-16 rounded-lg" />
				<SkeletonDefault class="w-full h-16 rounded-lg" />
				<SkeletonDefault class="w-full h-16 rounded-lg" />
				<SkeletonDefault class="w-full h-16 rounded-lg" />
			</div>
			<!-- Discover Music -->
			<div v-if="musics.length > 0 && !musicsFetching" class="space-y-8 text-center xl:space-y-10">
				<p class="text-xl font-bold lg:text-4xl">Discover Music</p>
				<div class="space-y-5">
					<div class="grid grid-cols-2 gap-5 xl:grid-cols-4">
						<LazyDiscoverMusic v-for="music in musics" :key="music.id" :music="music" />
					</div>
					<button class="px-3 py-1 rounded bg-quaternary" @click="reloadDiscoverMusic">
						Reload
					</button>
				</div>
			</div>
			<div v-else-if="musicsFetching" class="grid grid-cols-2 gap-5 xl:grid-cols-4">
				<SkeletonDefault class="w-full rounded-lg h-80" />
				<SkeletonDefault class="w-full rounded-lg h-80" />
				<SkeletonDefault class="w-full rounded-lg h-80" />
				<SkeletonDefault class="w-full rounded-lg h-80" />
			</div>
			<!-- Recent Release -->
			<LazyRecentReleases v-if="releases.length > 0 && !releasesFetching" :releases="releases" />
			<div v-else-if="releasesFetching" class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
			</div>
			<!-- Last Artist Added -->
			<LazyArtistAdded v-if="artists.length > 0 && !artistsFetching" :artists="artists" />
			<div v-else-if="artistsFetching" class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
				<SkeletonDefault class="w-full rounded-lg h-52" />
			</div>
		</section>
	</div>
</template>
