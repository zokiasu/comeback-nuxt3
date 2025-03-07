<script setup lang="ts">
	import {
		collection,
		getDocs,
		query,
		where,
		startAfter,
		orderBy,
		limit,
		getCountFromServer,
		QueryDocumentSnapshot,
		type DocumentData,
	} from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import { deletebyDoc } from '~/composables/useFirestore'
	import type { Artist } from '~/types/artist'
	import type { AlgoliaHit } from '~/types/algolia'
	import debounce from 'lodash.debounce'

	// Types
	interface FilterState {
		onlyWithoutDesc: boolean
		onlyWithoutSocials: boolean
		onlyWithoutPlatforms: boolean
		onlyWithoutStyles: boolean
	}

	// État
	const toast = useToast()
	const { $firestore: db } = useNuxtApp()

	const artistFetch = ref<Artist[]>([])
	const search = ref('')
	const invertSort = ref(true)
	const page = ref(1)

	const scrollContainer = ref<HTMLElement | null>(null)
	const sort = ref<keyof Artist | 'name'>('createdAt')
	const limitFetch = ref(48)
	const typeFilter = ref<Artist['type'] | ''>('')
	const isLoading = ref(false)
	const nextFetch = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
	const maxArtist = ref(0)
	const useAlgoliaForSearch = ref(true)

	// Algolia Search
	const { result, search: algoliaSearch } = useAlgoliaSearch('Artists')
	const algoliaResults = ref<Artist[]>([])
	const isSearching = ref(false)

	// Filtres
	const filterState = reactive<FilterState>({
		onlyWithoutDesc: false,
		onlyWithoutSocials: false,
		onlyWithoutPlatforms: false,
		onlyWithoutStyles: false,
	})

	// Computed
	const observerTarget = ref<HTMLElement | null>(null)
	const hasMore = computed(() => artistFetch.value.length < maxArtist.value)

	// Fonctions
	/**
	 * Supprime un artiste de la base de données et de la liste locale
	 */
	const deleteArtist = async (id: string): Promise<void> => {
		const artist = artistFetch.value.find((artist) => artist.id === id)
		if (artist) {
			const index = artistFetch.value.indexOf(artist)
			try {
				await deletebyDoc('artists', id)
				artistFetch.value.splice(index, 1)
				toast.success('Artiste supprimé')
			} catch (error) {
				console.error('Erreur lors de la suppression du document: ', error)
				toast.error('Erreur lors de la suppression de l\'artiste')
			}
		} else {
			toast.error('Artiste non trouvé')
		}
	}

	/**
	 * Récupère le nombre total d'artistes dans la base de données
	 */
	const getMaxArtistNumber = async (): Promise<void> => {
		try {
			const coll = collection(db, 'artists')
			const snapshot = await getCountFromServer(coll)
			maxArtist.value = snapshot.data().count
		} catch (error) {
			console.error('Erreur lors de la récupération du nombre d\'artistes: ', error)
			toast.error('Erreur lors du chargement des données')
		}
	}

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
			await useAsyncData(`search-${search.value}`, () => 
				algoliaSearch({ query: search.value })
			)
			
			if (result.value && result.value.hits) {
				// Convertir les résultats Algolia en format Artist
				algoliaResults.value = result.value.hits.map((hit: AlgoliaHit) => ({
					id: hit.objectID,
					name: hit.name || '',
					image: hit.image || '',
					description: hit.description || '',
					type: hit.type as Artist['type'] || 'SOLO',
					idYoutubeMusic: hit.idYoutubeMusic || '',
					styles: hit.styles || [],
					socialList: hit.socialList || [],
					platformList: hit.platformList || [],
					createdAt: hit.createdAt,
					updatedAt: hit.updatedAt,
				} as Artist))
			}
		} catch (error) {
			console.error('Erreur lors de la recherche Algolia:', error)
			toast.error('Erreur lors de la recherche')
		} finally {
			isSearching.value = false
		}
	}, 300)

	/**
	 * Construit la requête Firestore en fonction des filtres
	 */
	const buildArtistQuery = () => {
		let colRef = query(collection(db, 'artists'), orderBy(sort.value, 'desc'))

		// Filtre de recherche (si Algolia n'est pas utilisé)
		if (!useAlgoliaForSearch.value && search.value) {
			const searchTerm = search.value
			colRef = query(
				colRef,
				orderBy('name'),
				where('name', '>=', searchTerm),
				where('name', '<=', searchTerm + '\uF8FF'),
			)
		}

		// Filtres d'attributs manquants
		if (filterState.onlyWithoutDesc) {
			colRef = query(colRef, where('description', '==', ''))
		} else if (filterState.onlyWithoutSocials) {
			colRef = query(colRef, where('socialList', '==', []))
		} else if (filterState.onlyWithoutPlatforms) {
			colRef = query(colRef, where('platformList', '==', []))
		} else if (filterState.onlyWithoutStyles) {
			colRef = query(colRef, where('styles', '==', []))
		}

		// Filtre par type
		if (typeFilter.value !== '') {
			colRef = query(colRef, where('type', '==', typeFilter.value))
		}

		return colRef
	}

	/**
	 * Récupère les artistes depuis Firestore
	 */
	const getArtist = async (firstCall = false): Promise<void> => {
		if (isLoading.value) return
		isLoading.value = true

		try {
			// Récupère le nombre total d'artistes si nécessaire
			if (maxArtist.value === 0) {
				await getMaxArtistNumber()
			}

			// Construction de la requête
			let colRef = buildArtistQuery()

			// Pagination
			if (!firstCall && nextFetch.value) {
				colRef = query(colRef, startAfter(nextFetch.value))
			}

			// Limite de résultats
			colRef = query(colRef, limit(limitFetch.value))
			const snapshot = await getDocs(colRef)

			if (snapshot.empty) {
				isLoading.value = false
				return
			}

			// Mise à jour du curseur de pagination
			const lastVisible = snapshot.docs[snapshot.docs.length - 1]
			nextFetch.value = lastVisible

			// Transformation des données
			const artists = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Artist[]

			// Mise à jour de la liste
			if (firstCall) {
				artistFetch.value = artists
				nextFetch.value = lastVisible
			} else {
				artistFetch.value = [...artistFetch.value, ...artists]
			}

			console.log(
				'Artistes récupérés:',
				artists.length,
				'Total:',
				artistFetch.value.length,
				'Max:',
				maxArtist.value,
			)
		} catch (error) {
			console.error('Erreur lors de la récupération des documents: ', error)
			toast.error('Erreur lors du chargement des artistes')
		} finally {
			isLoading.value = false
		}
	}

	/**
	 * Change l'état des filtres "only without"
	 */
	const changeOnlyFilter = (filter: keyof FilterState): void => {
		// Réinitialise tous les filtres
		Object.keys(filterState).forEach((key) => {
			filterState[key as keyof FilterState] = false
		})
		
		// Active uniquement le filtre sélectionné
		filterState[filter] = !filterState[filter]
	}

	/**
	 * Trie la liste des artistes en fonction des critères
	 */
	const filteredArtistList = computed(() => {
		if (page.value !== 1) page.value = 1
		
		// Si une recherche est active et Algolia est utilisé, retourner les résultats d'Algolia
		if (useAlgoliaForSearch.value && search.value.length >= 2) {
			return algoliaResults.value
		}
		
		if (!artistFetch.value) return artistFetch.value

		return [...artistFetch.value].sort((a, b) => {
			if (sort.value === 'createdAt') {
				return invertSort.value 
					? (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0) 
					: (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
			}
			if (sort.value === 'updatedAt') {
				return invertSort.value 
					? (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0) 
					: (a.updatedAt?.toMillis() || 0) - (b.updatedAt?.toMillis() || 0)
			}
			if (sort.value === 'type') {
				return invertSort.value
					? (b.type || '').localeCompare(a.type || '')
					: (a.type || '').localeCompare(b.type || '')
			}
			return invertSort.value
				? (b.name || '').localeCompare(a.name || '')
				: (a.name || '').localeCompare(b.name || '')
		})
	})

	/**
	 * Charge tous les artistes
	 */
	const loadAllArtists = () => {
		limitFetch.value = maxArtist.value
		getArtist(true)
	}

	/**
	 * Bascule entre la recherche Algolia et Firebase
	 */
	const toggleSearchMethod = () => {
		useAlgoliaForSearch.value = !useAlgoliaForSearch.value
		if (!useAlgoliaForSearch.value && search.value) {
			getArtist(true)
		} else if (useAlgoliaForSearch.value && search.value) {
			performAlgoliaSearch()
		}
	}

	// Hooks
	onMounted(() => {
		// Configuration de l'observateur d'intersection pour le chargement infini
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

		// Observe l'élément cible quand il est disponible
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

		// Chargement initial des artistes
		getArtist(true)
	})

	// Watchers pour les filtres
	watch(
		[
			limitFetch,
			typeFilter,
			() => filterState.onlyWithoutDesc,
			() => filterState.onlyWithoutSocials,
			() => filterState.onlyWithoutPlatforms,
			() => filterState.onlyWithoutStyles,
			sort,
		],
		async () => {
			try {
				await getArtist(true)
			} catch (error) {
				console.error('Erreur dans le watcher:', error)
			}
		},
	)

	// Watcher pour la recherche
	watch(search, () => {
		if (useAlgoliaForSearch.value) {
			performAlgoliaSearch()
		} else {
			getArtist(true)
		}
	})
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section id="searchbar" class="sticky top-0 z-20 w-full space-y-2 bg-secondary pb-2">
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
					:title="useAlgoliaForSearch ? 'Utiliser Firebase (recherche basique)' : 'Utiliser Algolia (recherche avancée)'"
				>
					{{ useAlgoliaForSearch ? 'Algolia' : 'Firebase' }}
				</button>
			</div>
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
						:class="filterState.onlyWithoutDesc ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('onlyWithoutDesc')"
					>
						No description
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="filterState.onlyWithoutSocials ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('onlyWithoutSocials')"
					>
						No Socials
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="filterState.onlyWithoutPlatforms ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('onlyWithoutPlatforms')"
					>
						No Platforms
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="filterState.onlyWithoutStyles ? 'bg-primary' : 'bg-quinary'"
						@click="changeOnlyFilter('onlyWithoutStyles')"
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

		<div v-if="isSearching" class="flex justify-center">
			<p class="rounded bg-quinary px-4 py-2 text-center">Recherche en cours...</p>
		</div>

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

		<p v-else-if="!isSearching" class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
			No artist found
		</p>

		<div ref="observerTarget" class="mb-4 h-4 w-full"></div>

		<div
			v-if="
				!useAlgoliaForSearch &&
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
					@click="loadAllArtists"
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
