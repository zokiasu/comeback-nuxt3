<script setup>
	import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
	import { collection, onSnapshot } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'

	const toast = useToast()
	const { $firestore: db } = useNuxtApp()
	const { getPaginatedReleases } = useFirebaseFunction()

	const releaseFetch = ref([])
	const cursors = ref([null]) // Initialisez avec null pour la première page
	const pageSize = ref(24) // Nombre de releases par page
	const unsubscribe = ref(null) // Pour stocker la fonction de désabonnement

	const search = ref('')
	const sort = ref('date')
	const invertSort = ref(true)

	const artistPerPage = ref(24)
	const startAt = ref(0)
	const endAt = ref(artistPerPage.value)
	const page = ref(0) // Index de la page actuelle

	const needToBeVerifiedFilter = ref(false)
	const noNeedToBeVerifiedFilter = ref(false)

	const fetchPage = async (direction = 'next') => {
		const cursor = cursors.value[page.value]
		const { releases, newLastVisible } = await getPaginatedReleases(
			cursor,
			pageSize.value,
			direction,
		)
		releaseFetch.value = releases
		if (direction === 'next') {
			page.value++
			cursors.value[page.value] = newLastVisible
		} else if (direction === 'prev' && page.value > 0) {
			page.value--
		}
	}

	const nextPage = async () => {
		await fetchPage('next')
	}

	const previousPage = async () => {
		if (page.value > 0) {
			await fetchPage('prev')
		}
	}

	const deleteRelease = async (id) => {
		const release = releaseFetch.value.find((release) => release.idYoutubeMusic === id)
		if (release) {
			const index = releaseFetch.value.indexOf(release)
			releaseFetch.value.splice(index, 1)
		} else {
			toast.error('Release Not Found')
		}
	}

	const verifiedRelease = async (id) => {
		const release = releaseFetch.value.find((release) => release.idYoutubeMusic === id)
		if (release) {
			const index = releaseFetch.value.indexOf(release)
			release.needToBeVerified = false
			update('releases', id, release)
				.then(() => {
					releaseFetch.value.splice(index, 1, release)
					toast.success('Release Verified')
				})
				.catch((error) => {
					console.error('Error updating document: ', error)
					toast.error('Error Updating Release')
				})
		} else {
			toast.error('Release Not Found')
		}
	}

	// Fonction pour écouter les changements en temps réel
	const listenToReleaseChanges = () => {
		const colRef = collection(db, 'releases')
		unsubscribe.value = onSnapshot(colRef, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'modified') {
					const updatedRelease = { id: change.doc.id, ...change.doc.data() }
					const index = releaseFetch.value.findIndex(
						(release) => release.idYoutubeMusic === updatedRelease.idYoutubeMusic,
					)
					if (index !== -1) {
						releaseFetch.value[index] = updatedRelease
					}
				}
			})
		})
	}

	onMounted(async () => {
		await fetchPage()
		listenToReleaseChanges()
	})

	onUnmounted(() => {
		if (unsubscribe.value) {
			unsubscribe.value()
		}
	})

	const filteredReleaseList = computed(() => {
		if (page.value != 1) page.value = 1

		const releases = releaseFetch.value ? [...releaseFetch.value] : []

		if (!search.value) {
			return releases
				.sort((a, b) => {
					if (sort.value === 'createdAt') {
						if (!invertSort.value) return a.createdAt - b.createdAt
						return b.createdAt - a.createdAt
					}
					if (sort.value === 'date') {
						const aDate = new Date(a.date.seconds * 1000)
						const bDate = new Date(b.date.seconds * 1000)
						if (!invertSort.value) return aDate - bDate
						return bDate - aDate
					}
					if (sort.value === 'type') {
						if (!invertSort.value) return a.type.localeCompare(b.type)
						return b.type.localeCompare(a.type)
					}
					if (sort.value === 'name') {
						if (!invertSort.value) return a.name.localeCompare(b.name)
						return b.name.localeCompare(a.name)
					}
					if (sort.value === 'year') {
						if (!invertSort.value) return a.year - b.year
						return b.year - a.year
					}
					if (sort.value === 'artistsId') {
						if (!invertSort.value) return a.artistsId.localeCompare(b.artistsId)
						return b.artistsId.localeCompare(a.artistsId)
					}
				})
				.filter((release) => {
					if (needToBeVerifiedFilter.value) return release.needToBeVerified
					return true
				})
		} else {
			return releases
				.sort((a, b) => {
					if (sort.value === 'createdAt') {
						if (!invertSort.value) return a.createdAt - b.createdAt
						return b.createdAt - a.createdAt
					}
					if (sort.value === 'date') {
						const aDate = new Date(a.date.seconds * 1000)
						const bDate = new Date(b.date.seconds * 1000)
						if (!invertSort.value) return aDate - bDate
						return bDate - aDate
					}
					if (sort.value === 'type') {
						if (!invertSort.value) return a.type.localeCompare(b.type)
						return b.type.localeCompare(a.type)
					}
					if (sort.value === 'name') {
						if (!invertSort.value) return a.name.localeCompare(b.name)
						return b.name.localeCompare(a.name)
					}
					if (sort.value === 'year') {
						if (!invertSort.value) return a.year - b.year
						return b.year - a.year
					}
					if (sort.value === 'artistsId') {
						if (!invertSort.value) return a.artistsId.localeCompare(b.artistsId)
						return b.artistsId.localeCompare(a.artistsId)
					}
				})
				.filter((release) => {
					if (needToBeVerifiedFilter.value) return release.needToBeVerified
					if (noNeedToBeVerifiedFilter.value) return !release.needToBeVerified
					return (
						release.name.toLowerCase().includes(search.value.toLowerCase()) ||
						release.artistsName.toLowerCase().includes(search.value.toLowerCase()) ||
						release.idYoutubeMusic.includes(search.value)
					)
				})
		}
	})

	// nombre de page pour afficher artistPerPage.value artist parmis le nombre d'artist total
	const nbPage = computed(() => {
		if (!filteredReleaseList.value) return 0
		return Math.ceil(filteredReleaseList.value.length / artistPerPage.value)
	})

	watch([page], () => {
		if (page.value > nbPage.value) page.value = nbPage.value
		if (page.value < 1) page.value = 1
		startAt.value = (page.value - 1) * artistPerPage.value
		endAt.value = page.value * artistPerPage.value
	})
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section id="searchbar" class="sticky top-0 z-50 w-full space-y-2 bg-secondary pb-2">
			<input
				id="search-input"
				v-model="search"
				type="text"
				placeholder="Search"
				class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
			/>
			<section class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
				<div class="flex space-x-2">
					<select
						v-model="sort"
						class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
					>
						<option value="name">Name</option>
						<option value="type">Type</option>
						<option value="date">Date</option>
						<option value="year">Year</option>
						<option value="artistsId">Artist</option>
						<option value="createdAt">Last Created</option>
					</select>
					<button
						class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
						<icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						:class="needToBeVerifiedFilter ? 'bg-primary' : 'bg-quinary'"
						@click="needToBeVerifiedFilter = !needToBeVerifiedFilter"
					>
						Only NTBV
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						:class="noNeedToBeVerifiedFilter ? 'bg-primary' : 'bg-quinary'"
						@click="noNeedToBeVerifiedFilter = !noNeedToBeVerifiedFilter"
					>
						Only NNTBV
					</button>
				</div>

				<div class="flex w-full justify-between space-x-2 sm:justify-end">
					<!-- <button
            @click="page = 1"
            :disabled="startAt == 0"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            First
          </button> -->
					<button
						:disabled="page == 0"
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="previousPage"
					>
						Prev
					</button>
					<input
						v-model.number="page"
						type="text"
						class="w-10 rounded border-none bg-quinary p-2 text-center placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
					/>
					<button
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="nextPage"
					>
						Next
					</button>
					<!-- <button
            @click="page = nbPage"
            :disabled="page == nbPage"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            Last
          </button> -->
				</div>
			</section>
		</section>

		<div
			v-if="filteredReleaseList && filteredReleaseList.length > 0"
			id="release-list"
			class="grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:gap-2"
		>
			<div
				v-for="release in filteredReleaseList.slice(startAt, endAt)"
				:key="`key_` + release.idYoutubeMusic"
				class="h-full w-full"
			>
				<CardDashboardRelease
					:id="release.idYoutubeMusic"
					:artists-name="release.artistsName"
					:created-at="release.createdAt"
					:date="release.date"
					:id-youtube-music="release.idYoutubeMusic"
					:image="release.image"
					:name="release.name"
					:need-to-be-verified="release.needToBeVerified"
					:platform-list="release.platformList"
					:type="release.type"
					:year-released="release.year"
					@delete-release="deleteRelease"
				/>
			</div>
		</div>
		<p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
			No Release founded
		</p>
	</div>
</template>
