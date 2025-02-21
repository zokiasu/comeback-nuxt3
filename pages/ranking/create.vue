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
				class="whitespace-nowrap rounded bg-primary px-3 py-2 text-sm text-white hover:bg-primary/80 lg:py-1.5 lg:text-base"
				@click="createRanking"
			>
				Create Ranking
			</button>
		</div>
		<div class="flex flex-col-reverse gap-4 lg:grid lg:flex-1 lg:grid-cols-2">
			<!-- Search -->
			<div
				class="mx-auto h-full w-full space-y-3 rounded border border-quaternary p-2 lg:p-5"
			>
				<!-- Year Filter -->
				<div class="flex flex-wrap gap-2 text-sm lg:flex-nowrap lg:text-xl">
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2020 ? 'bg-primary' : 'bg-quinary'"
						@click="changeYearFilter(2020)"
					>
						2020
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2021 ? 'bg-primary' : 'bg-quinary'"
						@click="changeYearFilter(2021)"
					>
						2021
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2022 ? 'bg-primary' : 'bg-quinary'"
						@click="changeYearFilter(2022)"
					>
						2022
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2023 ? 'bg-primary' : 'bg-quinary'"
						@click="changeYearFilter(2023)"
					>
						2023
					</button>
					<button
						class="w-fit rounded p-3 text-white lg:w-full"
						:class="yearFilter === 2024 ? 'bg-primary' : 'bg-quinary'"
						@click="changeYearFilter(2024)"
					>
						2024
					</button>
				</div>
				<!-- Only M/V & Search -->
				<div class="flex gap-2">
					<button
						class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyMv ? 'bg-primary' : 'bg-quinary'"
						@click="onlyMv = !onlyMv"
					>
						Only M/V
					</button>
					<input
						id="search-input"
						v-model="search"
						type="text"
						placeholder="Search"
						class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
					/>
				</div>
				<!-- Sort -->
				<div class="flex items-center justify-between">
					<div class="flex flex-wrap items-center gap-2">
						<p class="text-xs uppercase">Sort by :</p>
						<div class="flex flex-wrap gap-2">
							<button
								class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
								:class="sorting === 'name' ? 'bg-primary' : 'bg-quinary'"
								@click="sorting = 'name'"
							>
								Name
							</button>
							<button
								class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
								:class="sorting === 'artist' ? 'bg-primary' : 'bg-quinary'"
								@click="sorting = 'artist'"
							>
								Artist Name
							</button>
							<button
								class="w-fit rounded px-3 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
								:class="sorting === 'date' ? 'bg-primary' : 'bg-quinary'"
								@click="sorting = 'date'"
							>
								Release Date
							</button>
						</div>
					</div>

					<button
						class="rounded border-none bg-quinary p-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="h-4 w-4 text-tertiary" />
						<icon-sort-reverse v-else class="h-4 w-4 text-tertiary" />
					</button>
				</div>
				<!-- Musics -->
				<div
					v-if="searchMusics.length > 0"
					class="scrollBarLight grid max-h-[35dvh] grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden pr-2 lg:max-h-[65dvh]"
				>
					<div v-for="song in searchMusics" :key="song.videoId" class="flex gap-2">
						<button
							class="flex items-center justify-center rounded bg-quaternary px-3 hover:bg-quinary"
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
							:music-date="song.date"
							:music-image="song.thumbnails[2].url || ''"
							:duration="song?.duration?.toString() || '0'"
							:has-mv="song.hasMv"
							horizontal-mode
						/>
					</div>
				</div>
				<div
					v-else
					class="scrollBarLight grid max-h-[35dvh] grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden pr-2 lg:max-h-[65dvh]"
				>
					<p class="text-center font-semibold text-tertiary/50">Loading data...</p>
				</div>
				<p v-if="searchMusics.length > 0" class="text-right text-xs italic">
					{{ searchMusics.length }} results
				</p>
			</div>
			<!-- Ranking -->
			<div
				class="mx-auto h-full w-full space-y-3 rounded border border-quaternary p-2 lg:p-5"
			>
				<p class="text-center text-xl font-bold xl:text-2xl">Ranking</p>
				<div class="scrollBarLight max-h-[75dvh] space-y-2 overflow-y-auto pr-2">
					<draggable
						v-model="rankingMusics"
						class="space-y-2"
						ghost-class="bg-tertiary/50"
						:animation="200"
						item-key="videoId"
						handle=".handle"
					>
						<template #item="{ element, index }">
							<div class="handle flex cursor-move gap-2">
								<div
									class="flex items-center justify-center rounded bg-quaternary px-3 text-xs lg:min-w-[55px] lg:text-base"
								>
									<span class="font-bold">#{{ index + 1 }}</span>
								</div>
								<MusicDisplay
									:artist-id="element?.artists[0]?.id || ''"
									:artist-name="element?.artists[0]?.name || ''"
									:music-id="element.videoId || ''"
									:music-name="element.name || ''"
									:music-image="element.thumbnails[2].url || ''"
									:music-date="element.date"
									:duration="element?.duration?.toString() || '0'"
									:has-mv="element.hasMv"
									horizontal-mode
								/>
								<button
									class="flex items-center justify-center rounded bg-quaternary px-3 hover:bg-quinary"
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import draggable from 'vuedraggable'
	import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import { useFirebaseRealtimeDatabase } from '@/composables/useFirebaseRealtimeDatabase'
	import { useFirebaseUtils } from '@/composables/useFirebaseUtils'
	import { useUserStore } from '@/stores/user'

	const toast = useToast()
	const router = useRouter()
	const { userDataStore, isLoginStore } = useUserStore()
	const { $firestore: database } = useNuxtApp()
	const { snapshotResultToArray } = useFirebaseUtils()
	const { writeDataWithRandomId } = useFirebaseRealtimeDatabase()

	const yearFilter = ref(2024)
	const musics = ref<any[]>([])
	const search = ref('')
	const onlyMv = ref(false)
	const rankingName = ref('')
	const rankingMusics = ref<any[]>([])
	const sorting = ref('date')
	const invertSort = ref(true)

	const addMusicToRanking = (music: any) => {
		if (!rankingMusics.value.includes(music)) {
			rankingMusics.value.push(music)
			toast.success('Music added to ranking')
		} else {
			toast.error('Music already in ranking')
		}
	}

	const getAllMusics = async () => {
		const colRef = collection(database as any, 'musics')
		const startDate = new Date(`${yearFilter.value}-01-01`)
		const endDate = new Date(`${yearFilter.value}-12-31`)

		const snapshot = await getDocs(
			query(
				colRef,
				where('date', '>=', startDate),
				where('date', '<=', endDate),
				orderBy('date', 'desc'),
			),
		)
		return snapshotResultToArray(snapshot)
	}

	const changeYearFilter = async (year: number) => {
		yearFilter.value = year
		musics.value = []
		musics.value = (await getAllMusics()) as any[]
	}

	const createRanking = async () => {
		if (!userDataStore?.id || !isLoginStore) return

		if (!rankingName.value) return toast.error('Ranking name is required')

		if (rankingMusics.value.length < 3)
			return toast.error('Ranking must have at least 3 musics')

		const path = `/rankings/${userDataStore.id}`

		try {
			await writeDataWithRandomId(path, {
				name: rankingName.value,
				musics: rankingMusics.value,
			})
			toast.success('Ranking created')
			router.push(`/profile/${userDataStore?.id}`)
		} catch (error) {
			console.error('Error updating ranking:', error)
			toast.error('Error updating ranking')
		}
	}

	const checkIsInRanking = (music: any) => {
		return rankingMusics.value.some((m) => m.videoId === music.videoId)
	}

	const searchMusics = computed(() => {
		return musics.value
			.filter((music) => {
				const matchesSearch =
					music.name.toLowerCase().includes(search.value.toLowerCase()) ||
					music.artists[0]?.name.toLowerCase().includes(search.value.toLowerCase())

				if (onlyMv.value) {
					return matchesSearch && music.hasMv
				}

				return matchesSearch
			})
			.sort((a, b) => {
				// Sort by name
				if (sorting.value === 'name') {
					if (!invertSort.value) {
						return a.name.localeCompare(b.name)
					}
					return b.name.localeCompare(a.name)
				}
				// Sort by artist name
				if (sorting.value === 'artist') {
					if (!invertSort.value) {
						return a.artists[0]?.name.localeCompare(b.artists[0]?.name)
					}
					return b.artists[0]?.name.localeCompare(a.artists[0]?.name)
				}
				// Sort by date
				if (sorting.value === 'date') {
					const dateA = a.date.toDate().getTime()
					const dateB = b.date.toDate().getTime()
					if (!invertSort.value) {
						return dateA - dateB
					}
					return dateB - dateA
				}
				return 0
			})
	})

	onMounted(async () => {
		musics.value = (await getAllMusics()) as any[]

		if (!isLoginStore) {
			toast.info('You must be logged in to create a ranking')
		}
	})
</script>
