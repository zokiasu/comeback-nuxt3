<template>
	<div class="min-h-dvh-wo-nav lg:max-h-dvh-wo-nav flex flex-col space-y-5 p-5">
		<div class="flex items-end justify-between gap-2">
			<ComebackInput
				v-model="rankingName"
				label="Ranking Name"
				placeholder="Enter a ranking name"
				class="w-full"
			/>
			<button
				class="bg-cb-primary-900 hover:bg-cb-primary-900/80 rounded px-3 py-2 text-sm whitespace-nowrap text-white lg:py-1.5 lg:text-base"
				@click="updateRanking"
			>
				Update Ranking
			</button>
		</div>
		<div class="flex flex-col-reverse gap-4 lg:grid lg:flex-1 lg:grid-cols-2">
			<!-- Search -->
			<div
				class="border-cb-quaternary-950 mx-auto h-full w-full space-y-3 rounded border p-2 lg:p-5"
			>
				<!-- Year Filter -->
				<div class="flex flex-wrap gap-2 text-sm lg:flex-nowrap lg:text-xl">
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2020 ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="changeYearFilter(2020)"
					>
						2020
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2021 ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="changeYearFilter(2021)"
					>
						2021
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2022 ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="changeYearFilter(2022)"
					>
						2022
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2023 ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="changeYearFilter(2023)"
					>
						2023
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2024 ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="changeYearFilter(2024)"
					>
						2024
					</button>
				</div>
				<!-- Only M/V & Search -->
				<div class="flex gap-2">
					<button
						class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyMv ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
						@click="onlyMv = !onlyMv"
					>
						Only M/V
					</button>
					<input
						id="search-input"
						v-model="search"
						type="text"
						placeholder="Search"
						class="bg-cb-quinary-900 placeholder-cb-tertiary-200 focus:bg-cb-tertiary-200 focus:text-cb-quinary-900 focus:placeholder-cb-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
					/>
				</div>
				<!-- Sort -->
				<div class="flex flex-wrap items-center gap-2">
					<p class="text-xs uppercase">Sort by :</p>
					<div class="flex flex-wrap gap-2">
						<button
							class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
							:class="sorting === 'name' ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
							@click="sorting = 'name'"
						>
							Name
						</button>
						<button
							class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
							:class="sorting === 'artist' ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
							@click="sorting = 'artist'"
						>
							Artist Name
						</button>
						<button
							class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
							:class="sorting === 'date' ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'"
							@click="sorting = 'date'"
						>
							Release Date
						</button>
					</div>
				</div>
				<div
					v-if="searchMusics.length > 0"
					class="scrollBarLight grid max-h-[35dvh] grid-cols-1 gap-4 overflow-x-hidden overflow-y-auto pr-2 lg:max-h-[65dvh]"
				>
					<div v-for="song in searchMusics" :key="song.videoId" class="flex gap-2">
						<button
							class="bg-cb-quaternary-950 hover:bg-cb-quinary-900 flex items-center justify-center rounded px-3"
							:class="checkIsInRanking(song) ? 'cursor-not-allowed opacity-30' : ''"
							@click="addMusicToRanking(song)"
						>
							<IconPlus class="h-5 w-5" />
						</button>
						<MusicDisplay
							:artist-id="song?.artists[0]?.id || ''"
							:artist-name="song?.artists[0]?.name || ''"
							:music-id="song.videoId || ''"
							:music-name="song.name || ''"
							:music-image="song.thumbnails[2].url || ''"
							:duration="song?.duration?.toString() || '0'"
							:has-mv="song.ismv"
							horizontal-mode
						/>
					</div>
				</div>
				<div
					v-else
					class="scrollBarLight grid max-h-[35dvh] grid-cols-1 gap-4 overflow-x-hidden overflow-y-auto pr-2 lg:max-h-[65dvh]"
				>
					<p class="text-cb-tertiary-200/50 text-center font-semibold">Loading data...</p>
				</div>
			</div>
			<!-- Ranking -->
			<div
				class="border-cb-quaternary-950 mx-auto h-full w-full space-y-3 rounded border p-2 lg:p-5"
			>
				<p class="text-center text-xl font-bold xl:text-2xl">Ranking</p>
				<div
					v-if="rankingMusics.length > 0"
					class="scrollBarLight max-h-[75dvh] space-y-2 overflow-y-auto pr-2"
				>
					<draggable
						v-model="rankingMusics"
						class="space-y-2"
						ghost-class="bg-cb-tertiary-200/50"
						:animation="200"
						item-key="videoId"
						handle=".handle"
					>
						<template #item="{ element, index }">
							<div class="handle flex cursor-move gap-2">
								<div
									class="bg-cb-quaternary-950 flex items-center justify-center rounded px-3 text-xs lg:min-w-[55px] lg:text-base"
								>
									<span class="font-bold">#{{ index + 1 }}</span>
								</div>
								<MusicDisplay
									:artist-id="element?.artists[0]?.id || ''"
									:artist-name="element?.artists[0]?.name || ''"
									:music-id="element.videoId || ''"
									:music-name="element.name || ''"
									:music-image="element.thumbnails[2].url || ''"
									:duration="element?.duration?.toString() || '0'"
									:has-mv="element.ismv"
									horizontal-mode
								/>
								<button
									class="bg-cb-quaternary-950 hover:bg-cb-quinary-900 flex items-center justify-center rounded px-3"
									@click.stop="
										rankingMusics = rankingMusics.filter(
											(m) => m.videoId !== element.videoId,
										)
									"
								>
									<IconClose class="h-5 w-5" />
								</button>
							</div>
						</template>
					</draggable>
				</div>
				<div
					v-else
					class="scrollBarLight grid max-h-[35dvh] grid-cols-1 gap-4 overflow-x-hidden overflow-y-auto pr-2 lg:max-h-[65dvh]"
				>
					<p class="text-cb-tertiary-200/50 text-center font-semibold">Loading data...</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import draggable from 'vuedraggable'
	import { collection, getDocs, query, where } from 'firebase/firestore'
	import { storeToRefs } from 'pinia'

	import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'
	import { useFirebaseUtils } from '~/composables/useFirebaseUtils'
	import { useUserStore } from '@/stores/user'

	const toast = useToast()
	const route = useRoute()
	const router = useRouter()
	const { userDataStore, isLoginStore } = storeToRefs(useUserStore())
	const { $firestore: database } = useNuxtApp()
	const { snapshotResultToArray } = useFirebaseUtils()
	const { writeData, readData } = useFirebaseRealtimeDatabase()

	const yearFilter = ref(2024)
	const musics = ref<any[]>([])
	const search = ref('')
	const onlyMv = ref(false)
	const rankingName = ref('')
	const rankingMusics = ref<any[]>([])
	const sorting = ref('date')

	const addMusicToRanking = (music: any) => {
		if (!rankingMusics.value.includes(music)) {
			rankingMusics.value.push(music)
			toast.add({
				title: 'Music added to ranking',
				color: 'success',
			})
		} else {
			toast.add({
				title: 'Music already in ranking',
				color: 'error',
			})
		}
	}

	const getAllMusics = async () => {
		const colRef = collection(database as any, 'musics')
		const snapshot = await getDocs(query(colRef, where('year', '==', yearFilter.value)))
		return snapshotResultToArray(snapshot)
	}

	const getRanking = async (id: string) => {
		const path = `/rankings/${userDataStore.value.id}/${id}`
		return await readData(path)
	}

	const changeYearFilter = async (year: number) => {
		yearFilter.value = year
		musics.value = []
		musics.value = (await getAllMusics()) as any[]
	}

	const updateRanking = async () => {
		if (!userDataStore.value.id || !isLoginStore.value) return

		const path = `/rankings/${userDataStore.value.id}/${route.params.id}`
		try {
			await writeData(path, {
				name: rankingName.value,
				musics: rankingMusics.value,
			})
			toast.add({
				title: 'Ranking updated',
				color: 'success',
			})
			router.push(`/profile/${userDataStore.value.id}`)
		} catch (error) {
			console.error('Error updating ranking:', error)
			toast.add({
				title: 'Error updating ranking',
				color: 'error',
			})
		}
	}

	const searchMusics = computed(() => {
		return musics.value
			.filter((music) => {
				const matchesSearch =
					music.name.toLowerCase().includes(search.value.toLowerCase()) ||
					music.artists[0]?.name.toLowerCase().includes(search.value.toLowerCase())

				if (onlyMv.value) {
					return matchesSearch && music.ismv
				}

				return matchesSearch
			})
			.sort((a, b) => {
				// Sort by name
				if (sorting.value === 'name') {
					return a.name.localeCompare(b.name)
				}
				// Sort by artist name
				if (sorting.value === 'artist') {
					return a.artists[0]?.name.localeCompare(b.artists[0]?.name)
				}
				// Sort by date
				if (sorting.value === 'date') {
					const dateA = new Date(a.year, a.month, a.day).getTime()
					const dateB = new Date(b.year, b.month, b.day).getTime()
					return dateA - dateB
				}
				return 0
			})
	})

	const checkIsInRanking = (music: any) => {
		return rankingMusics.value.some((m) => m.videoId === music.videoId)
	}

	onMounted(async () => {
		musics.value = (await getAllMusics()) as any[]
		const rankingData = await getRanking(route.params.id as string)
		rankingName.value = rankingData.name
		rankingMusics.value = rankingData.musics

		if (!isLoginStore.value) {
			toast.add({
				title: 'You must be logged in to edit a ranking',
				color: 'info',
			})
		}
	})
</script>
