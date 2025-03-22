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
	import debounce from 'lodash.debounce'
	import type { Release } from '~/types/release'
	import { useFirebaseRelease } from '~/composables/Firebase/useFirebaseRelease'
	import type { AlgoliaHit } from '~/types/algolia'

	const { deleteRelease: deleteReleaseFunction } = useFirebaseRelease()
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
	const useAlgoliaForSearch = ref(true)
	const firstLoad = ref(true)

	// Algolia Search
	const { result, search: algoliaSearch } = useAlgoliaSearch('Releases')
	const algoliaResults = ref<Release[]>([])
	const isSearching = ref(false)

	const needToBeVerifiedFilter = ref<boolean>(false)
	const noNeedToBeVerifiedFilter = ref<boolean>(false)

	const observerTarget = ref<HTMLElement | null>(null)
	const hasMore = computed(() => releaseFetch.value.length < maxRelease.value)

	/**
	 * Effectue une recherche avec Algolia
	 */
	const performAlgoliaSearch = debounce(async () => {
		if (search.value.length < 2) {
			algoliaResults.value = []
			return
		}

		isSearching.value = true
		try {
			await useAsyncData(`release-search-${search.value}`, () =>
				algoliaSearch({ query: search.value }),
			)

			if (result.value && result.value.hits) {
				// Convertir les résultats Algolia en format Release
				algoliaResults.value = result.value.hits.map(
					(hit: AlgoliaHit) =>
						({
							id: hit.objectID,
							idYoutubeMusic: hit.idYoutubeMusic || hit.objectID,
							name: hit.name || '',
							image: hit.image || '',
							type: hit.type || '',
							artistsName: hit.artistsName || '',
							artistsId: hit.artistsId || '',
							date: hit.date,
							year: hit.year || 0,
							needToBeVerified: hit.needToBeVerified || false,
							platformList: hit.platformList || [],
							createdAt: hit.createdAt,
						}) as Release,
				)
			}
		} catch (error) {
			console.error('Erreur lors de la recherche Algolia:', error)
			toast.error('Erreur lors de la recherche')
		} finally {
			isSearching.value = false
		}
	}, 300)

	/**
	 * Bascule entre la recherche Algolia et Firebase
	 */
	const toggleSearchMethod = () => {
		useAlgoliaForSearch.value = !useAlgoliaForSearch.value
		if (!useAlgoliaForSearch.value && search.value) {
			getRelease(true)
		} else if (useAlgoliaForSearch.value && search.value) {
			performAlgoliaSearch()
		}
	}

	const getMaxReleaseNumber = async () => {
		const coll = collection(db, 'releases')
		const snapshot = await getCountFromServer(coll)
		maxRelease.value = snapshot.data().count
	}

	const getRelease = async (firstCall = false) => {
		if (isLoading.value) {
			console.log('Déjà en cours de chargement, ignoré')
			return
		}

		isLoading.value = true
		console.log('Début du chargement des releases, firstCall:', firstCall)

		try {
			if (maxRelease.value === 0) {
				await getMaxReleaseNumber()
			}

			let colRef = query(collection(db, 'releases'), orderBy(sort.value, 'desc'))

			// Filtre de recherche (si Algolia n'est pas utilisé)
			if (!useAlgoliaForSearch.value && search.value) {
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

			// Pagination - utiliser le dernier document comme point de départ pour la pagination
			if (!firstCall && nextFetch.value) {
				console.log('Utilisation de startAfter pour la pagination')
				colRef = query(colRef, startAfter(nextFetch.value))
			} else if (firstCall) {
				console.log('Premier appel, réinitialisation de la liste')
				// Réinitialiser la liste et le curseur pour le premier appel
				releaseFetch.value = []
				nextFetch.value = null
			}

			// Limiter le nombre de résultats par requête
			// Utiliser une valeur plus petite pour le chargement progressif
			const fetchLimit = firstCall ? limitFetch.value : Math.min(limitFetch.value, 12)
			colRef = query(colRef, limit(fetchLimit))
			console.log(`Limite de fetch: ${fetchLimit}`)

			const snapshot = await getDocs(colRef)

			if (snapshot.empty) {
				console.log('Aucun résultat trouvé')
				isLoading.value = false
				return
			}

			// Stocker le dernier document visible pour la pagination
			const lastVisible = snapshot.docs[snapshot.docs.length - 1]
			nextFetch.value = lastVisible

			// Transformer les documents en objets Release
			const releases = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Release[]

			console.log(`${releases.length} releases récupérés`)

			// Mettre à jour la liste des releases
			if (firstCall) {
				releaseFetch.value = releases
			} else {
				// Ajouter les nouveaux releases à la liste existante
				releaseFetch.value = [...releaseFetch.value, ...releases]
			}

			console.log(
				'Releases récupérés:',
				releases.length,
				'Total:',
				releaseFetch.value.length,
				'Max:',
				maxRelease.value,
				'Reste à charger:',
				maxRelease.value - releaseFetch.value.length,
			)

			// Marquer que le premier chargement est terminé
			if (firstCall) {
				firstLoad.value = false
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des documents:', error)
			toast.error('Erreur lors du chargement des releases')
		} finally {
			isLoading.value = false
		}
	}

	const deleteRelease = async (id: string) => {
		try {
			const res = await deleteReleaseFunction(id)
			if (res === 'success') {
				toast.success('Release supprimé')
				releaseFetch.value = releaseFetch.value.filter(
					(release) => release.idYoutubeMusic !== id,
				)
			} else {
				console.log('Erreur lors de la suppression du release')
				toast.error('Erreur lors de la suppression du release')
			}
		} catch (error) {
			console.error('Erreur lors de la suppression du release:', error)
			toast.error('Erreur lors de la suppression du release')
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
				toast.success('Release vérifié')
			})
			.catch((error) => {
				console.error('Erreur lors de la mise à jour du document:', error)
				toast.error('Erreur lors de la mise à jour du release')
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
		// Configuration de l'observateur d'intersection pour le chargement infini
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (
					entry.isIntersecting &&
					hasMore.value &&
					!isLoading.value &&
					!useAlgoliaForSearch.value
				) {
					console.log('Intersection détectée, chargement de plus de releases...')
					await getRelease(false) // Utiliser false pour indiquer que ce n'est pas le premier appel
				}
			},
			{
				// Utiliser null comme root pour observer par rapport au viewport
				rootMargin: '200px', // Réduire encore la marge pour un déclenchement plus précis
				threshold: 0.1, // Maintenir le seuil pour une détection sensible
			},
		)

		// Observer l'élément cible quand il est disponible
		if (observerTarget.value) {
			observer.observe(observerTarget.value)
		}

		watch(observerTarget, (el) => {
			if (el) {
				observer.observe(el)
			}
		})

		// Nettoyage de l'observateur
		onBeforeUnmount(() => {
			if (observerTarget.value) {
				observer.unobserve(observerTarget.value)
			}
			observer.disconnect()
		})

		// Chargement initial des releases
		getRelease(true)

		// Écouter les changements en temps réel
		const unsubscribe = listenToReleaseChanges()
		onBeforeUnmount(() => {
			unsubscribe()
		})
	})

	// Watchers pour les filtres
	watch(
		[limitFetch, needToBeVerifiedFilter, noNeedToBeVerifiedFilter, sort],
		async () => {
			nextFetch.value = null
			await getRelease(true)
		},
	)

	// Watcher pour la recherche
	watch(search, () => {
		if (useAlgoliaForSearch.value) {
			performAlgoliaSearch()
		} else {
			nextFetch.value = null
			getRelease(true)
		}
	})

	const filteredReleaseList = computed(() => {
		// Si une recherche est active et Algolia est utilisé, retourner les résultats d'Algolia
		if (useAlgoliaForSearch.value && search.value.length >= 2) {
			return algoliaResults.value
		}

		if (!releaseFetch.value) return []

		return [...releaseFetch.value].sort((a, b) => {
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
				if (!a.date || !b.date) return 0
				const aDate = new Date(a.date.seconds * 1000)
				const bDate = new Date(b.date.seconds * 1000)
				return invertSort.value
					? bDate.getTime() - aDate.getTime()
					: aDate.getTime() - bDate.getTime()
			}
			if (sort.value === 'type') {
				return invertSort.value
					? (b.type || '').localeCompare(a.type || '')
					: (a.type || '').localeCompare(b.type || '')
			}
			if (sort.value === 'name') {
				return invertSort.value
					? (b.name || '').localeCompare(a.name || '')
					: (a.name || '').localeCompare(b.name || '')
			}
			if (sort.value === 'year') {
				return invertSort.value
					? (b.year || 0) - (a.year || 0)
					: (a.year || 0) - (b.year || 0)
			}
			if (sort.value === 'artistsId') {
				return invertSort.value
					? (b.artistsId || '').localeCompare(a.artistsId || '')
					: (a.artistsId || '').localeCompare(a.artistsId || '')
			}
			return 0
		})
	})

	/**
	 * Charge tous les releases
	 */
	const loadAllReleases = () => {
		limitFetch.value = maxRelease.value
		getRelease(true)
	}
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section id="searchbar" class="sticky top-0 z-50 w-full space-y-2 bg-secondary pb-2">
			<div class="relative">
				<input
					id="search-input"
					v-model="search"
					type="text"
					placeholder="Search"
					class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
				/>
				<button
					class="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-tertiary px-2 py-1 text-xs text-quinary"
					@click="toggleSearchMethod"
					:title="
						useAlgoliaForSearch
							? 'Utiliser Firebase (recherche basique)'
							: 'Utiliser Algolia (recherche avancée)'
					"
				>
					{{ useAlgoliaForSearch ? 'Algolia' : 'Firebase' }}
				</button>
			</div>
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

		<div v-if="isSearching" class="flex justify-center">
			<p class="rounded bg-quinary px-4 py-2 text-center">Recherche en cours...</p>
		</div>

		<div
			v-if="filteredReleaseList && filteredReleaseList.length > 0"
			id="release-list"
			class="grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:gap-2"
		>
			<div
				v-for="release in filteredReleaseList"
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
					@verified-release="verifiedRelease(release)"
				/>
			</div>
		</div>

		<p
			v-else-if="!isSearching"
			class="w-full bg-quaternary p-5 text-center font-semibold uppercase"
		>
			Aucun release trouvé
		</p>

		<div v-if="isLoading && !firstLoad" class="flex justify-center py-4">
			<p class="rounded bg-quinary px-4 py-2 text-center">Chargement des releases...</p>
		</div>

		<div
			v-if="hasMore && !useAlgoliaForSearch"
			ref="observerTarget"
			class="my-8 flex h-20 w-full items-center justify-center rounded bg-gray-200 bg-opacity-10"
		>
			<div v-if="!isLoading" class="text-xs text-gray-400">
				Faites défiler pour charger plus de releases
			</div>
			<div v-else class="loading-indicator">
				<div class="loading-dot"></div>
				<div class="loading-dot"></div>
				<div class="loading-dot"></div>
			</div>
		</div>

		<div
			v-if="
				!useAlgoliaForSearch &&
				filteredReleaseList.length > 0 &&
				releaseFetch.length != maxRelease
			"
			class="flex flex-col items-center space-y-2 text-xs"
		>
			<p>({{ releaseFetch.length }} / {{ maxRelease }})</p>
			<div v-if="!isLoading" class="flex gap-2">
				<button
					class="mx-auto flex w-full gap-1 rounded bg-quinary px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
					@click="loadAllReleases"
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

<style scoped>
	.loading-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.loading-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #666;
		animation: pulse 1.5s infinite ease-in-out;
	}

	.loading-dot:nth-child(2) {
		animation-delay: 0.3s;
	}

	.loading-dot:nth-child(3) {
		animation-delay: 0.6s;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
