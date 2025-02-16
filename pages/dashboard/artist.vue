<script setup>
	import {
		collection,
		getDocs,
		query,
		where,
		startAfter,
		orderBy,
		limit,
		getCountFromServer,
	} from 'firebase/firestore'
	import { useToast } from 'vue-toastification'

	const toast = useToast()
	const { $firestore: db } = useNuxtApp()

	const artistFetch = ref([])
	const search = ref('')
	const invertSort = ref(true)
	const page = ref(1)

	const scrollContainer = ref(null)
	const sort = ref('createdAt')
	const limitFetch = ref(48)
	const typeFilter = ref('')
	const onlyWithoutDesc = ref(false)
	const onlyWithoutSocials = ref(false)
	const onlyWithoutPlatforms = ref(false)
	const onlyWithoutStyles = ref(false)
	const isLoading = ref(false)
	const nextFetch = ref(null)
	const maxArtist = ref(0)

	const observerTarget = ref(null)
	const hasMore = computed(() => artistFetch.value.length < maxArtist.value)

	const deleteArtist = async (id) => {
		const artist = artistFetch.value.find((artist) => artist.id === id)
		if (artist) {
			const index = artistFetch.value.indexOf(artist)
			await deletebyDoc('artists', id)
				.then(() => {
					artistFetch.value.splice(index, 1)
					toast.success('Artist Deleted')
				})
				.catch((error) => {
					console.error('Error removing document: ', error)
					toast.error('Error Removing Artist')
				})
		} else {
			toast.error('Artist Not Found')
		}
	}

	const getMaxArtistNumber = async () => {
		const coll = collection(db, 'artists')
		const snapshot = await getCountFromServer(coll)
		maxArtist.value = snapshot.data().count
	}

	const getArtist = async (firstCall = false) => {
		if (isLoading.value) return
		isLoading.value = true

		if (maxArtist.value === 0) {
			await getMaxArtistNumber()
		}

		let colRef = query(collection(db, 'artists'), orderBy(sort.value, 'desc'))

		if (search.value) {
			const searchTerm = search.value
			colRef = query(
				colRef,
				orderBy('name'),
				where('name', '>=', searchTerm),
				where('name', '<=', searchTerm + '\uF8FF'),
			)
		}

		if (onlyWithoutDesc.value) {
			colRef = query(colRef, where('description', '==', ''))
		} else if (onlyWithoutSocials.value) {
			colRef = query(colRef, where('socialList', '==', []))
		} else if (onlyWithoutPlatforms.value) {
			colRef = query(colRef, where('platformList', '==', []))
		} else if (onlyWithoutStyles.value) {
			colRef = query(colRef, where('styles', '==', []))
		}

		if (typeFilter.value !== '') {
			colRef = query(colRef, where('type', '==', typeFilter.value))
		}

		try {
			if (!firstCall && nextFetch.value) {
				colRef = query(colRef, startAfter(nextFetch.value))
			}

			colRef = query(colRef, limit(limitFetch.value))
			const snapshot = await getDocs(colRef)

			if (snapshot.empty) {
				isLoading.value = false
				return
			}

			const lastVisible = snapshot.docs[snapshot.docs.length - 1]
			nextFetch.value = lastVisible

			const artists = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))

			if (firstCall) {
				artistFetch.value = artists
				nextFetch.value = lastVisible
			} else {
				artistFetch.value = [...artistFetch.value, ...artists]
			}

			console.log(
				'Fetched artists:',
				artists.length,
				'Total:',
				artistFetch.value.length,
				'Max:',
				maxArtist.value,
			)
		} catch (error) {
			console.error('Error getting documents: ', error)
			toast.error('Error Loading Artists')
		} finally {
			isLoading.value = false
		}
	}

	const changeOnlyFilter = (filter) => {
		if (filter === 'desc') {
			onlyWithoutDesc.value = !onlyWithoutDesc.value
			onlyWithoutSocials.value = false
			onlyWithoutPlatforms.value = false
			onlyWithoutStyles.value = false
		}
		if (filter === 'socials') {
			onlyWithoutSocials.value = !onlyWithoutSocials.value
			onlyWithoutDesc.value = false
			onlyWithoutPlatforms.value = false
			onlyWithoutStyles.value = false
		}
		if (filter === 'platforms') {
			onlyWithoutPlatforms.value = !onlyWithoutPlatforms.value
			onlyWithoutDesc.value = false
			onlyWithoutSocials.value = false
			onlyWithoutStyles.value = false
		}
		if (filter === 'styles') {
			onlyWithoutStyles.value = !onlyWithoutStyles.value
			onlyWithoutDesc.value = false
			onlyWithoutSocials.value = false
			onlyWithoutPlatforms.value = false
		}
	}

	const filteredArtistList = computed(() => {
		if (page !== 1) page.value = 1
		if (!artistFetch.value) return artistFetch.value

		return artistFetch.value.sort((a, b) => {
			if (sort.value === 'createdAt') {
				return invertSort.value ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
			}
			if (sort.value === 'updatedAt') {
				return invertSort.value ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
			}
			if (sort.value === 'type') {
				return invertSort.value
					? b.type.localeCompare(a.type)
					: a.type.localeCompare(b.type)
			}
			return invertSort.value
				? b.name.localeCompare(a.name)
				: a.name.localeCompare(b.name)
		})
	})

	onMounted(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting && hasMore.value && !isLoading.value) {
					await getArtist()
				}
			},
			{
				rootMargin: '2000px',
				threshold: 0.01,
			},
		)

		if (observerTarget.value) {
			observer.observe(observerTarget.value)
		}

		watch(observerTarget, (el) => {
			if (el) {
				observer.observe(el)
			}
		})

		onBeforeUnmount(() => {
			if (observerTarget.value) {
				observer.unobserve(observerTarget.value)
			}
			observer.disconnect()
		})

		getArtist(true)
	})

	watch(
		[
			limitFetch,
			typeFilter,
			onlyWithoutDesc,
			onlyWithoutSocials,
			onlyWithoutPlatforms,
			onlyWithoutStyles,
			sort,
			search,
		],
		async () => {
			try {
				await getArtist(true)
			} catch (error) {
				console.error('Error in watcher:', error)
			}
		},
	)
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section id="searchbar" class="sticky top-0 z-20 w-full space-y-2 bg-secondary pb-2">
			<input
				id="search-input"
				v-model="search"
				type="text"
				placeholder="Search"
				class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
			/>
			<div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
				<div class="flex w-fit flex-wrap justify-between gap-2 sm:flex-nowrap">
					<div
						class="flex w-full flex-row items-center justify-between gap-2 rounded bg-quinary px-2 py-1 text-xs uppercase sm:w-fit sm:justify-start"
					>
						<p class="sm:text-nowrap">Fetch Number</p>
						<select
							v-model="limitFetch"
							class="rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary transition-all duration-300 ease-in-out focus:outline-none sm:w-fit"
						>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="30">30</option>
							<option value="40">40</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="200">200</option>
							<option value="500">500</option>
						</select>
					</div>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyWithoutDesc ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('desc')"
					>
						No description
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyWithoutSocials ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('socials')"
					>
						No Socials
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyWithoutPlatforms ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('platforms')"
					>
						No Platforms
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="onlyWithoutStyles ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('styles')"
					>
						No Styles
					</button>
				</div>
				<div class="flex space-x-2">
					<select
						v-model="sort"
						class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
					>
						<option value="name">Name</option>
						<option value="type">Type</option>
						<option value="createdAt">Last Created</option>
						<option value="updatedAt">Last Updated</option>
					</select>
					<button
						class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
						<icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
					</button>
				</div>
			</div>
		</section>

		<transition-group
			v-if="filteredArtistList.length > 0"
			id="artist-list"
			name="list-complete"
			tag="div"
			class="grid grid-cols-1 items-center justify-center gap-2 transition-all duration-300 ease-in-out md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
		>
			<LazyCardDashboardArtist
				v-for="artist in filteredArtistList"
				:id="artist.id"
				:key="artist.id"
				:image="artist.image"
				:name="artist.name"
				:description="artist.description"
				:type="artist.type"
				:id-youtube-music="artist.idYoutubeMusic"
				:styles="artist.styles"
				:social-list="artist.socialList"
				:platform-list="artist.platformList"
				:created-at="artist.createdAt"
				:updated-at="artist.updatedAt"
				@delete-artist="deleteArtist"
			/>
		</transition-group>

		<p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
			No artist found
		</p>

		<div ref="observerTarget" class="mb-4 h-4 w-full"></div>

		<div
			v-if="
				filteredArtistList.length > 0 &&
				artistFetch.length != 0 &&
				artistFetch.length != maxArtist
			"
			class="flex flex-col items-center space-y-2 text-xs"
		>
			<p>({{ artistFetch.length }} / {{ maxArtist }})</p>
			<div v-if="!isLoading" class="flex gap-2">
				<button
					class="mx-auto flex w-full gap-1 rounded bg-quinary px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
					@click="
						($event) => {
							limitFetch = maxArtist
							getArtist(true)
						}
					"
				>
					<p>Load All</p>
				</button>
			</div>
			<p
				v-else
				class="mx-auto flex w-full gap-1 rounded bg-quinary px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
			>
				Loading...
			</p>
		</div>
	</div>
</template>
