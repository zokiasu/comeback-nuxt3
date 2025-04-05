<script setup lang="ts">
	import type { News } from '~/types/supabase/news'
	import { useSupabaseNews } from '~/composables/Supabase/useSupabaseNews'

	const toast = useToast()
	const { getAllNews, deleteNews: deleteNewsFunction } = useSupabaseNews()

	const newsFetch = ref<News[]>([])
	const isLoading = ref(false)
	const search = ref('')
	const sort = ref('date')
	const invertSort = ref(true)
	const limitFetch = ref(24)
	const currentPage = ref(1)
	const totalPages = ref(1)
	const totalNews = ref(0)
	const observerTarget = ref<HTMLElement | null>(null)
	const hasMore = computed(() => currentPage.value <= totalPages.value)

	const fetchNews = async (firstCall = false) => {
		if (isLoading.value) return
		isLoading.value = true

		try {
			// Si c'est le premier appel, réinitialiser la page
			if (firstCall) {
				currentPage.value = 1
				newsFetch.value = []
			}

			// Récupérer les news pour la page courante
			const result = await getAllNews({
				search: search.value,
				orderBy: sort.value as keyof News,
				orderDirection: invertSort.value ? 'desc' : 'asc',
				limit: limitFetch.value,
				offset: (currentPage.value - 1) * limitFetch.value,
			})

			// Mettre à jour les données
			totalNews.value = result.total
			totalPages.value = result.totalPages

			// Ajouter les nouvelles news à la liste
			if (firstCall) {
				newsFetch.value = result.news
			} else {
				newsFetch.value = [...newsFetch.value, ...result.news]
			}

			// Incrémenter la page courante
			currentPage.value++
		} catch (error) {
			console.error('Erreur lors de la récupération des news:', error)
			toast.error('Erreur lors du chargement des news')
		} finally {
			isLoading.value = false
		}
	}

	onMounted(() => {
		// Configuration de l'observateur d'intersection pour le chargement infini
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting && hasMore.value && !isLoading.value) {
					await fetchNews()
				}
			},
			{
				rootMargin: '200px',
				threshold: 0.1,
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

		// Chargement initial des news
		fetchNews(true)
	})

	const deleteNews = async (id: string) => {
		try {
			const success = await deleteNewsFunction(id)
			if (success) {
				newsFetch.value = newsFetch.value.filter((news) => news.id !== id)
				toast.success('News supprimée')
			} else {
				toast.error('Erreur lors de la suppression de la news')
			}
		} catch (error) {
			console.error('Erreur lors de la suppression de la news:', error)
			toast.error('Erreur lors de la suppression de la news')
		}
	}

	const sortNews = (a: News, b: News) => {
		if (sort.value === 'created_at') {
			if (!a.created_at && !b.created_at) return 0
			if (!a.created_at) return invertSort.value ? -1 : 1
			if (!b.created_at) return invertSort.value ? 1 : -1
			return invertSort.value
				? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				: new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		}

		if (sort.value === 'date') {
			if (!a.date && !b.date) return 0
			if (!a.date) return invertSort.value ? -1 : 1
			if (!b.date) return invertSort.value ? 1 : -1
			return invertSort.value
				? new Date(b.date).getTime() - new Date(a.date).getTime()
				: new Date(a.date).getTime() - new Date(b.date).getTime()
		}

		if (sort.value === 'user') {
			if (!a.user?.id && !b.user?.id) return 0
			if (!a.user?.id) return invertSort.value ? -1 : 1
			if (!b.user?.id) return invertSort.value ? 1 : -1
			return invertSort.value
				? b.user.id.localeCompare(a.user.id)
				: a.user.id.localeCompare(b.user.id)
		}

		if (sort.value === 'artist') {
			if (!a.artists?.[0]?.id && !b.artists?.[0]?.id) return 0
			if (!a.artists?.[0]?.id) return invertSort.value ? -1 : 1
			if (!b.artists?.[0]?.id) return invertSort.value ? 1 : -1
			return invertSort.value
				? b.artists[0].id.localeCompare(a.artists[0].id)
				: a.artists[0].id.localeCompare(b.artists[0].id)
		}

		return 0
	}

	const filteredNewsList = computed(() => {
		if (!newsFetch.value || newsFetch.value.length === 0) return []

		// Appliquer d'abord le tri
		const sortedNews = [...newsFetch.value].sort(sortNews)

		// Ensuite appliquer le filtre de recherche si nécessaire
		if (!search.value) {
			return sortedNews
		}

		const searchTerm = search.value.toLowerCase()
		return sortedNews.filter((news) => {
			const userName = news.user?.name?.toLowerCase() || ''
			const artistName = news.artists?.[0]?.name?.toLowerCase() || ''
			const message = news.message?.toLowerCase() || ''

			return (
				userName.includes(searchTerm) ||
				artistName.includes(searchTerm) ||
				message.includes(searchTerm)
			)
		})
	})

	watch([search, sort, invertSort, limitFetch], () => {
		fetchNews(true)
	})
</script>

<template>
	<div
		ref="scrollContainer"
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<section
			id="searchbar"
			class="bg-secondary-950 sticky top-0 z-50 w-full space-y-2 pb-2"
		>
			<input
				id="search-input"
				v-model="search"
				type="text"
				placeholder="Rechercher par artiste, utilisateur ou message"
				class="bg-quinary-900 placeholder-tertiary-200 focus:bg-tertiary-200 focus:text-quinary-900 focus:placeholder-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
			/>
			<section class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
				<div class="flex space-x-2">
					<select
						v-model="sort"
						class="bg-quinary-900 placeholder-tertiary-200 hover:bg-tertiary-200 hover:text-quinary-900 w-full rounded border-none p-2 text-xs uppercase drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none sm:w-fit"
					>
						<option value="date">Date</option>
						<option value="user">User</option>
						<option value="artist">Artist</option>
						<option value="created_at">Last Created</option>
					</select>
					<button
						class="bg-quinary-900 placeholder-tertiary-200 hover:bg-tertiary-200 hover:text-quinary-900 rounded border-none p-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="text-tertiary-200 h-6 w-6" />
						<icon-sort-reverse v-else class="text-tertiary-200 h-6 w-6" />
					</button>
					<select
						v-model="limitFetch"
						class="bg-quinary-900 placeholder-tertiary-200 rounded border-none p-2 text-xs uppercase transition-all duration-300 ease-in-out focus:outline-none sm:w-fit"
					>
						<option value="12">12</option>
						<option value="24">24</option>
						<option value="36">36</option>
						<option value="48">48</option>
					</select>
				</div>
			</section>
		</section>

		<div v-if="isLoading && currentPage === 1" class="flex justify-center py-4">
			<p class="bg-quinary-900 rounded px-4 py-2 text-center">Chargement des news...</p>
		</div>

		<transition-group
			v-if="filteredNewsList.length > 0"
			id="news-list"
			name="list-complete"
			tag="div"
			class="grid grid-cols-1 items-center justify-center gap-5 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			<LazyCardDashboardNews
				v-for="news in filteredNewsList"
				:id="news.id"
				:key="news.id"
				:message="news.message"
				:artists="news.artists"
				:date="news.date"
				:user="news.user || {}"
				:verified="news.verified"
				@delete-news="deleteNews(news.id)"
			/>
		</transition-group>

		<p
			v-else-if="!isLoading"
			class="bg-quaternary-950 w-full p-5 text-center font-semibold uppercase"
		>
			Aucune news trouvée
		</p>

		<div v-if="isLoading && currentPage > 1" class="flex justify-center py-4">
			<p class="bg-quinary-900 rounded px-4 py-2 text-center">
				Chargement des news suivantes...
			</p>
		</div>

		<div
			v-if="hasMore"
			ref="observerTarget"
			class="bg-opacity-10 my-8 flex h-20 w-full items-center justify-center rounded bg-gray-200"
		>
			<div v-if="!isLoading" class="text-xs text-gray-400">
				Faites défiler pour charger plus de news
			</div>
			<div v-else class="loading-indicator">
				<div class="loading-dot"></div>
				<div class="loading-dot"></div>
				<div class="loading-dot"></div>
			</div>
		</div>

		<div
			v-if="filteredNewsList.length > 0 && newsFetch.length !== totalNews"
			class="flex flex-col items-center space-y-2 text-xs"
		>
			<p>({{ newsFetch.length }} / {{ totalNews }})</p>
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

	.list-complete-enter-active,
	.list-complete-leave-active {
		transition: all 0.3s ease;
	}
	.list-complete-enter-from,
	.list-complete-leave-to {
		opacity: 0;
		transform: translateY(30px);
	}
</style>
