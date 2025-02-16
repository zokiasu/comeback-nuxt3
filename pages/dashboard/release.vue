<script setup lang="ts">
	import {
		collection,
		query,
		where,
		orderBy,
		limit,
		getCountFromServer,
		onSnapshot,
		or,
		getDocs,
		startAfter,
		doc,
		updateDoc,
	} from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import type { Release } from '~/types/release'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'

	const { deleteRelease: deleteReleaseFunction } = useFirebaseFunction()
	const toast = useToast()
	const { $firestore: db } = useNuxtApp()

	const releaseFetch = ref<Release[]>([])
	const search = ref<string>('')
	const sort = ref<string>('date')
	const invertSort = ref<boolean>(true)
	const isLoading = ref<boolean>(false)
	const nextFetch = ref<any>(null)
	const maxRelease = ref<number>(0)
	const limitFetch = ref<number>(24)

	const needToBeVerifiedFilter = ref<boolean>(false)
	const noNeedToBeVerifiedFilter = ref<boolean>(false)

	const observerTarget = ref<HTMLElement | null>(null)
	const hasMore = computed(() => releaseFetch.value.length < maxRelease.value)

	const getMaxReleaseNumber = async () => {
		const coll = collection(db, 'releases')
		const snapshot = await getCountFromServer(coll)
		maxRelease.value = snapshot.data().count
	}

	const getRelease = async (firstCall = false) => {
		if (isLoading.value) return
		isLoading.value = true

		if (maxRelease.value === 0) {
			await getMaxReleaseNumber()
		}

		let colRef = query(collection(db, 'releases'), orderBy(sort.value, 'desc'))

		if (search.value) {
			const searchTerm = search.value.toLowerCase()
			colRef = query(
				colRef,
				or(
					where('name', '>=', searchTerm),
					where('name', '<=', searchTerm + '\uF8FF'),
					where('artistsName', '>=', searchTerm),
					where('artistsName', '<=', searchTerm + '\uF8FF'),
				),
			)
		}

		if (needToBeVerifiedFilter.value) {
			colRef = query(colRef, where('needToBeVerified', '==', true))
		} else if (noNeedToBeVerifiedFilter.value) {
			colRef = query(colRef, where('needToBeVerified', '==', false))
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

			const releases = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Release[]

			if (firstCall) {
				releaseFetch.value = releases
				nextFetch.value = lastVisible
			} else {
				releaseFetch.value = [...releaseFetch.value, ...releases]
			}

			console.log(
				'Fetched releases:',
				releases.length,
				'Total:',
				releaseFetch.value.length,
				'Max:',
				maxRelease.value,
			)
		} catch (error) {
			console.error('Error getting documents: ', error)
			toast.error('Error Loading Releases')
		} finally {
			isLoading.value = false
		}
	}

	const deleteRelease = async (id: string) => {
		try {
			const res = await deleteReleaseFunction(id)
			if (res === 'success') {
				toast.success('Release deleted')
				releaseFetch.value = releaseFetch.value.filter(
					(release) => release.idYoutubeMusic !== id,
				)
			} else {
				console.log('Error deleting release')
				toast.error('Error deleting release')
			}
		} catch (error) {
			console.error('Error deleting release:', error)
			toast.error('Error deleting release')
		}
	}

	const verifiedRelease = async (release: Release) => {
		release.needToBeVerified = false
		const docRef = doc(db, 'releases', release.idYoutubeMusic)
		await updateDoc(docRef, { needToBeVerified: false })
			.then(() => {
				releaseFetch.value = releaseFetch.value.filter(
					(r) => r.idYoutubeMusic !== release.idYoutubeMusic,
				)
				toast.success('Release Verified')
			})
			.catch((error) => {
				console.error('Error updating document: ', error)
				toast.error('Error when updating release')
			})
	}

	// Fonction pour écouter les changements en temps réel
	const listenToReleaseChanges = () => {
		const colRef = collection(db, 'releases')
		const unsubscribe = onSnapshot(colRef, (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'modified') {
					const updatedRelease = { id: change.doc.id, ...change.doc.data() } as Release
					const index = releaseFetch.value.findIndex(
						(release) => release.idYoutubeMusic === updatedRelease.idYoutubeMusic,
					)
					if (index !== -1) {
						releaseFetch.value[index] = updatedRelease
					}
				}
			})
		})
		return unsubscribe
	}

	onMounted(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting && hasMore.value && !isLoading.value) {
					await getRelease()
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

		getRelease(true)
		const unsubscribe = listenToReleaseChanges()
		onBeforeUnmount(() => {
			unsubscribe()
		})
	})

	watch(
		[limitFetch, needToBeVerifiedFilter, noNeedToBeVerifiedFilter, sort, search],
		async () => {
			nextFetch.value = null
			await getRelease(true)
		},
	)

	const filteredReleaseList = computed(() => {
		if (!releaseFetch.value) return []

		return releaseFetch.value.sort((a, b) => {
			if (sort.value === 'createdAt') {
				// Si createdAt n'est pas défini, on met ces éléments à la fin
				if (!a.createdAt && !b.createdAt) return 0
				if (!a.createdAt) return invertSort.value ? -1 : 1
				if (!b.createdAt) return invertSort.value ? 1 : -1

				const aDate = new Date(a.createdAt.seconds * 1000)
				const bDate = new Date(b.createdAt.seconds * 1000)
				return invertSort.value
					? bDate.getTime() - aDate.getTime()
					: aDate.getTime() - bDate.getTime()
			}
			if (sort.value === 'date') {
				const aDate = new Date(a.date.seconds * 1000)
				const bDate = new Date(b.date.seconds * 1000)
				return invertSort.value
					? bDate.getTime() - aDate.getTime()
					: aDate.getTime() - bDate.getTime()
			}
			if (sort.value === 'type') {
				return invertSort.value
					? b.type.localeCompare(a.type)
					: a.type.localeCompare(b.type)
			}
			if (sort.value === 'name') {
				return invertSort.value
					? b.name.localeCompare(a.name)
					: a.name.localeCompare(b.name)
			}
			if (sort.value === 'year') {
				return invertSort.value ? b.year - a.year : a.year - b.year
			}
			if (sort.value === 'artistsId') {
				return invertSort.value
					? b.artistsId.localeCompare(a.artistsId)
					: a.artistsId.localeCompare(a.artistsId)
			}
			return 0
		})
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
			</section>
		</section>

		<div
			v-if="filteredReleaseList && filteredReleaseList.length > 0"
			id="release-list"
			class="grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:gap-2"
		>
			<div
				v-for="(release, index) in filteredReleaseList"
				:key="`key_` + release.idYoutubeMusic"
				class="h-full w-full"
			>
				<CardDashboardRelease
					:id="release.idYoutubeMusic"
					:artists-name="release.artistsName"
					:created-at="release.createdAt || null"
					:date="release.date"
					:id-youtube-music="release.idYoutubeMusic"
					:image="release.image"
					:name="release.name"
					:need-to-be-verified="release.needToBeVerified"
					:platform-list="release.platformList"
					:type="release.type"
					:year-released="release.year"
					@delete-release="deleteRelease"
					@verified-release="verifiedRelease(release, index)"
				/>
			</div>
		</div>

		<p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
			No Release founded
		</p>

		<div ref="observerTarget" class="mb-4 h-4 w-full"></div>

		<div
			v-if="filteredReleaseList.length > 0 && releaseFetch.length != maxRelease"
			class="flex flex-col items-center space-y-2 text-xs"
		>
			<p>({{ releaseFetch.length }} / {{ maxRelease }})</p>
			<div v-if="!isLoading" class="flex gap-2">
				<button
					class="mx-auto flex w-full gap-1 rounded bg-quinary px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
					@click="
						($event) => {
							limitFetch = maxRelease
							getRelease(true)
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
