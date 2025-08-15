<script setup lang="ts">
	import { useDebounce } from '~/composables/useDebounce'
	import type { Artist } from '~/types'
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'
	import { useInfiniteScroll } from '@vueuse/core'

	// Utilisation de Supabase uniquement pour la base de données
	import type { AlgoliaHit } from '@/types/algolia'

	// Types
	interface FilterState {
		onlyWithoutDesc: boolean
		onlyWithoutSocials: boolean
		onlyWithoutPlatforms: boolean
		onlyWithoutStyles: boolean
	}

	// État
	const toast = useToast()
	const { getArtistsByPage } = useSupabaseArtist()

	const artistFetch = ref<Artist[]>([])
	const search = ref('')
	const invertSort = ref(false)
	const page = ref(1)
	const currentPage = ref(1)
	const totalPages = ref(1)
	const totalArtists = ref(0)

	const scrollContainer = useTemplateRef('scrollContainer')
	const sort = ref<keyof Artist>('name')
	const limitFetch = ref(48)
	const typeFilter = ref<Artist['type'] | ''>('')
	const isLoading = ref(false)
	const useAlgoliaForSearch = ref(true)

	// Algolia Search
	const { result, search: algoliaSearch } = useAlgoliaSearch('ARTISTS')
	const algoliaResults = ref<Artist[]>([])
	const isSearching = ref(false)

	// Filtres
	const filterState = reactive<FilterState>({
		onlyWithoutDesc: false,
		onlyWithoutSocials: false,
		onlyWithoutPlatforms: false,
		onlyWithoutStyles: false,
	})

	const activeCareerFilter = ref<'all' | 'active' | 'inactive'>('all')

	// Computed
	const observerTarget = useTemplateRef('observerTarget')
	const hasMore = computed(() => currentPage.value <= totalPages.value)

	// État pour le modal de confirmation
	const deleteModal = reactive({
		isOpen: false,
		artistId: '',
		artistName: ''
	})

	// Fonctions
	/**
	 * Ouvre le modal de confirmation de suppression
	 */
	const openDeleteModal = (id: string): void => {
		const artist = artistFetch.value.find(a => a.id === id)
		if (artist) {
			deleteModal.artistId = id
			deleteModal.artistName = artist.name
			deleteModal.isOpen = true
		}
	}

	/**
	 * Ferme le modal de confirmation
	 */
	const closeDeleteModal = (): void => {
		deleteModal.isOpen = false
		deleteModal.artistId = ''
		deleteModal.artistName = ''
	}

	/**
	 * Confirme la suppression et met à jour la liste locale
	 */
	const confirmDelete = (): void => {
		// Supprimer l'artiste de la liste locale
		artistFetch.value = artistFetch.value.filter(a => a.id !== deleteModal.artistId)
		
		// Mettre à jour le compteur total
		totalArtists.value = Math.max(0, totalArtists.value - 1)
		
		closeDeleteModal()
	}

	/**
	 * Effectue une recherche avec Algolia
	 */
	const performAlgoliaSearch = useDebounce(async () => {
		if (search.value.length < 2) {
			algoliaResults.value = []
			return
		}

		isSearching.value = true
		try {
			await useAsyncData(`search-${search.value}`, () =>
				algoliaSearch({ query: search.value }),
			)

			if (result.value && result.value.hits) {
				// Convertir les résultats Algolia en format Artist Supabase
				algoliaResults.value = result.value.hits.map((hit: AlgoliaHit) => ({
					id: hit.objectID,
					id_youtube_music: hit.idYoutubeMusic || '',
					name: hit.name || '',
					image: hit.image || 'https://i.ibb.co/wLhbFZx/Frame-255.png',
					description: hit.description || '',
					birth_date: null,
					debut_date: null,
					gender: 'UNKNOWN',
					type: (hit.type as Artist['type']) || 'SOLO',
					verified: false,
					active_career: true,
					general_tags: null,
					styles: hit.styles || [],
					social_links: [],
					platform_links: [],
					created_at: hit.createdAt?.toDate().toISOString() || new Date().toISOString(),
					updated_at: hit.updatedAt?.toDate().toISOString() || new Date().toISOString(),
				}))
			}
		} catch (error) {
			console.error('Erreur lors de la recherche Algolia:', error)
			toast.add({
				title: 'Erreur lors de la recherche',
				description: 'Une erreur est survenue lors de la recherche',
				color: 'error',
			})
		} finally {
			isSearching.value = false
		}
	}, 300)

	/**
	 * Récupère les artistes depuis Supabase
	 */
	const getArtist = async (firstCall = false): Promise<void> => {
		if (isLoading.value) return
		isLoading.value = true

		try {
			if (firstCall) {
				currentPage.value = 1
				artistFetch.value = []
			}

			const result = await getArtistsByPage(currentPage.value, limitFetch.value, {
				search: search.value,
				type: typeFilter.value || undefined,
				orderBy: sort.value,
				orderDirection: invertSort.value ? 'desc' : 'asc',
				isActive:
					activeCareerFilter.value === 'all'
						? undefined
						: activeCareerFilter.value === 'active'
							? true
							: false,
			})

			totalArtists.value = result.total
			totalPages.value = result.totalPages

			if (firstCall) {
				artistFetch.value = result.artists
			} else {
				artistFetch.value = [...artistFetch.value, ...result.artists]
			}

			currentPage.value++
		} catch (error) {
			console.error('Erreur lors de la récupération des artistes:', error)
			toast.add({
				title: 'Erreur lors du chargement des artistes',
				description: 'Une erreur est survenue lors du chargement des artistes',
				color: 'error',
			})
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
	 * Bascule entre la recherche Algolia et Supabase
	 */
	const toggleSearchMethod = (): void => {
		useAlgoliaForSearch.value = !useAlgoliaForSearch.value

		// Refaire la recherche avec la nouvelle méthode
		if (search.value.length >= 2) {
			if (useAlgoliaForSearch.value) {
				performAlgoliaSearch()
			} else {
				getArtist(true)
			}
		}
	}

	/**
	 * Charge tous les artistes restants
	 */
	const loadAllArtists = async (): Promise<void> => {
		while (currentPage.value <= totalPages.value && !isLoading.value) {
			await getArtist(false)
		}
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
			if (sort.value === 'created_at') {
				return invertSort.value
					? new Date(b.created_at ?? '').getTime() -
							new Date(a.created_at ?? '').getTime()
					: new Date(a.created_at ?? '').getTime() -
							new Date(b.created_at ?? '').getTime()
			}
			if (sort.value === 'updated_at') {
				return invertSort.value
					? new Date(b.updated_at ?? '').getTime() -
							new Date(a.updated_at ?? '').getTime()
					: new Date(a.updated_at ?? '').getTime() -
							new Date(b.updated_at ?? '').getTime()
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

	const loadMore = async () => {
		if (isLoading.value || currentPage.value > totalPages.value) return
		await getArtist(false)
	}

	useInfiniteScroll(scrollContainer, loadMore, {
		distance: 200,
		canLoadMore: () => currentPage.value <= totalPages.value && !isLoading.value,
	})

	// Lifecycle hooks
	onMounted(async () => {
		await getArtist(true)
	})

	// Watchers
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

	watch(activeCareerFilter, () => {
		getArtist(true)
	})

	definePageMeta({
		middleware: ['admin'],
	})
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section
			id="searchbar"
			class="bg-cb-secondary-950 sticky top-0 z-20 w-full space-y-2 pb-2"
		>
			<div class="relative">
				<input
					id="search-input"
					v-model="search"
					type="text"
					placeholder="Search"
					class="bg-cb-quinary-900 placeholder-cb-tertiary-200 focus:bg-cb-tertiary-200 focus:text-cb-quinary-900 focus:placeholder-cb-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
				/>
				<button
					class="bg-cb-tertiary-200 text-cb-quinary-900 absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 py-1 text-xs"
					:title="
						useAlgoliaForSearch
							? 'Utiliser Supabase (recherche basique)'
							: 'Utiliser Algolia (recherche avancée)'
					"
					@click="toggleSearchMethod"
				>
					{{ useAlgoliaForSearch ? 'Algolia' : 'Supabase' }}
				</button>
			</div>
			<div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
				<div class="flex w-fit flex-wrap justify-between gap-2 sm:flex-nowrap">
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="
							filterState.onlyWithoutDesc ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'
						"
						@click="changeOnlyFilter('onlyWithoutDesc')"
					>
						No description
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="
							filterState.onlyWithoutSocials ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'
						"
						@click="changeOnlyFilter('onlyWithoutSocials')"
					>
						No Socials
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="
							filterState.onlyWithoutPlatforms ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'
						"
						@click="changeOnlyFilter('onlyWithoutPlatforms')"
					>
						No Platforms
					</button>
					<button
						class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500 lg:text-nowrap"
						:class="
							filterState.onlyWithoutStyles ? 'bg-cb-primary-900' : 'bg-cb-quinary-900'
						"
						@click="changeOnlyFilter('onlyWithoutStyles')"
					>
						No Styles
					</button>
					<select
						v-model="activeCareerFilter"
						class="bg-cb-quinary-900 placeholder-cb-tertiary-200 rounded border-none p-2 text-xs uppercase transition-all duration-300 ease-in-out focus:outline-none sm:w-fit"
					>
						<option value="all">Tous</option>
						<option value="active">Actifs</option>
						<option value="inactive">Inactifs</option>
					</select>
				</div>
				<div class="flex space-x-2">
					<select
						v-model="sort"
						class="bg-cb-quinary-900 placeholder-cb-tertiary-200 hover:bg-cb-tertiary-200 hover:text-cb-quinary-900 w-full rounded border-none p-2 text-xs uppercase drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none sm:w-fit"
					>
						<option value="name">Name</option>
						<option value="type">Type</option>
						<option value="created_at">Last Created</option>
						<option value="updated_at">Last Updated</option>
					</select>
					<button
						class="bg-cb-quinary-900 placeholder-cb-tertiary-200 hover:bg-cb-tertiary-200 hover:text-cb-quinary-900 rounded border-none p-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="text-cb-tertiary-200 h-6 w-6" />
						<icon-sort-reverse v-else class="text-cb-tertiary-200 h-6 w-6" />
					</button>
				</div>
			</div>
		</section>

		<div v-if="isSearching" class="flex justify-center">
			<p class="bg-cb-quinary-900 rounded px-4 py-2 text-center">Recherche en cours...</p>
		</div>

		<transition-group
			v-if="filteredArtistList.length > 0"
			id="artist-list"
			name="list-complete"
			tag="div"
			class="grid grid-cols-1 items-center justify-center gap-2 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-4"
		>
			<CardDashboardArtist
				v-for="artist in filteredArtistList"
				:id="artist.id"
				:key="artist.id"
				:image="artist.image ?? undefined"
				:name="artist.name"
				:description="artist.description || ''"
				:type="artist.type ?? undefined"
				:id-youtube-music="artist.id_youtube_music ?? undefined"
				:styles="artist.styles || []"
				:social-list="artist.social_links ?? []"
				:platform-list="artist.platform_links ?? []"
				:is-active="artist.active_career ?? false"
				:created-at="artist.created_at ?? undefined"
				:updated-at="artist.updated_at ?? undefined"
				@delete-artist="openDeleteModal"
			/>
		</transition-group>

		<p
			v-else-if="!isSearching"
			class="bg-cb-quaternary-950 w-full p-5 text-center font-semibold uppercase"
		>
			No artist found
		</p>

		<div ref="observerTarget" class="mb-4 h-4 w-full"></div>

		<div
			v-if="
				!useAlgoliaForSearch &&
				filteredArtistList.length > 0 &&
				artistFetch.length != 0 &&
				artistFetch.length != totalArtists
			"
			class="flex flex-col items-center space-y-2 text-xs"
		>
			<p>({{ artistFetch.length }} / {{ totalArtists }})</p>
			<div v-if="!isLoading" class="flex gap-2">
				<button
					class="bg-cb-quinary-900 mx-auto flex w-full gap-1 rounded px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
					@click="loadAllArtists"
				>
					<p>Load All</p>
				</button>
			</div>
			<p
				v-else
				class="bg-cb-quinary-900 mx-auto flex w-full gap-1 rounded px-2 py-1 uppercase hover:bg-zinc-500 md:w-fit"
			>
				Loading...
			</p>
		</div>

		<!-- Modal de confirmation de suppression -->
		<ModalConfirmDeleteArtist
			:is-open="deleteModal.isOpen"
			:artist-id="deleteModal.artistId"
			:artist-name="deleteModal.artistName"
			@close="closeDeleteModal"
			@confirm="confirmDelete"
		/>
	</div>
</template>
