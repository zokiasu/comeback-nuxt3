<script setup lang="ts">
	import { useToast } from 'vue-toastification'
	import { queryByCollection, deletebyDoc } from '~/composables/Firebase/useFirestore'

	interface News {
		taskId: string
		message: string
		date?: { seconds: number; nanoseconds: number }
		createdAt?: number
		user?: { id: string; name: string }
		artist?: { id: string; name: string }
		artists?: any[]
		verified?: boolean
	}

	const toast = useToast()
	const newsFetch = ref<News[]>([])
	const isLoading = ref(false)

	const search = ref('')
	const sort = ref('date')
	const invertSort = ref(true)

	const startAt = ref(0)
	const endAt = ref(12)
	const page = ref(1)

	const fetchNews = async () => {
		isLoading.value = true
		try {
			const result = await queryByCollection('news')
			if (Array.isArray(result)) {
				newsFetch.value = result as News[]
				console.log(`${result.length} news récupérées`)
			} else {
				console.error('Résultat inattendu:', result)
				toast.error('Erreur lors du chargement des news')
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des news:', error)
			toast.error('Erreur lors du chargement des news')
		} finally {
			isLoading.value = false
		}
	}

	onMounted(async () => {
		await fetchNews()
	})

	const deleteNews = async (id: string) => {
		const newsToDelete = newsFetch.value.find((news) => news.taskId === id)

		if (newsToDelete) {
			const index = newsFetch.value.indexOf(newsToDelete)
			try {
				await deletebyDoc('news', id)
				newsFetch.value.splice(index, 1)
				toast.success('News supprimée')
			} catch (error) {
				console.error('Erreur lors de la suppression du document:', error)
				toast.error('Erreur lors de la suppression de la news')
			}
		} else {
			toast.error('News non trouvée')
		}
	}

	const sortNews = (a: News, b: News) => {
		if (sort.value === 'createdAt') {
			if (!a.createdAt && !b.createdAt) return 0
			if (!a.createdAt) return invertSort.value ? -1 : 1
			if (!b.createdAt) return invertSort.value ? 1 : -1
			return invertSort.value ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
		}

		if (sort.value === 'date') {
			if (!a.date?.seconds && !b.date?.seconds) return 0
			if (!a.date?.seconds) return invertSort.value ? -1 : 1
			if (!b.date?.seconds) return invertSort.value ? 1 : -1

			const aDate = new Date(a.date.seconds * 1000)
			const bDate = new Date(b.date.seconds * 1000)
			return invertSort.value
				? bDate.getTime() - aDate.getTime()
				: aDate.getTime() - bDate.getTime()
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
			if (!a.artist?.id && !b.artist?.id) return 0
			if (!a.artist?.id) return invertSort.value ? -1 : 1
			if (!b.artist?.id) return invertSort.value ? 1 : -1

			return invertSort.value
				? b.artist.id.localeCompare(a.artist.id)
				: a.artist.id.localeCompare(b.artist.id)
		}

		return 0
	}

	const filteredNewsList = computed(() => {
		if (page.value !== 1) page.value = 1
		if (!newsFetch.value || newsFetch.value.length === 0) return []

		// Appliquer d'abord le tri
		const sortedNews = [...newsFetch.value].sort(sortNews)

		// Ensuite appliquer le filtre de recherche si nécessaire
		if (!search.value) {
			return sortedNews
		}

		const searchTerm = search.value.toLowerCase()
		return sortedNews.filter((news) => {
			// Vérifier que les propriétés existent avant d'appeler toLowerCase()
			const userName = news.user?.name?.toLowerCase() || ''
			const artistName = news.artist?.name?.toLowerCase() || ''
			const message = news.message?.toLowerCase() || ''

			return (
				userName.includes(searchTerm) ||
				artistName.includes(searchTerm) ||
				message.includes(searchTerm)
			)
		})
	})

	const nbPage = computed(() => {
		return Math.ceil(filteredNewsList.value.length / 12)
	})

	watch([page], () => {
		if (page.value > nbPage.value && nbPage.value > 0) page.value = nbPage.value
		if (page.value < 1) page.value = 1
		startAt.value = (page.value - 1) * 12
		endAt.value = page.value * 12
	})

	// Ajouter un watcher pour la recherche pour faciliter le débogage
	watch(search, (newValue) => {
		console.log(`Recherche: "${newValue}" - Résultats: ${filteredNewsList.value.length}`)
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
				placeholder="Rechercher par artiste, utilisateur ou message"
				class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
			/>
			<section class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
				<div class="flex space-x-2">
					<select
						v-model="sort"
						class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
					>
						<option value="date">Date</option>
						<option value="user">User</option>
						<option value="artist">Artist</option>
						<option value="createdAt">Last Created</option>
					</select>
					<button
						class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
						@click="invertSort = !invertSort"
					>
						<icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
						<icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
					</button>
				</div>

				<div class="flex w-full justify-between space-x-2 sm:justify-end">
					<button
						:disabled="startAt == 0"
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="page = 1"
					>
						First
					</button>
					<button
						:disabled="startAt == 0"
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="page--"
					>
						Prev
					</button>
					<input
						v-model.number="page"
						type="text"
						class="w-10 rounded border-none bg-quinary p-2 text-center placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
					/>
					<button
						:disabled="page == nbPage"
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="page++"
					>
						Next
					</button>
					<button
						:disabled="page == nbPage"
						class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
						@click="page = nbPage"
					>
						Last
					</button>
				</div>
			</section>
		</section>

		<div v-if="isLoading" class="flex justify-center py-4">
			<p class="rounded bg-quinary px-4 py-2 text-center">Chargement des news...</p>
		</div>

		<transition-group
			v-if="filteredNewsList.length > 0"
			id="news-list"
			name="list-complete"
			tag="div"
			class="grid grid-cols-1 items-center justify-center gap-5 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			<LazyCardDashboardNews
				v-for="news in filteredNewsList.slice(startAt, endAt)"
				:id="news.taskId"
				:key="news.taskId"
				:message="news.message"
				:artist="news.artist"
				:artists="news.artists"
				:date="news.date"
				:user="news.user"
				:verified="news.verified"
				@delete-news="deleteNews(news.taskId)"
			/>
		</transition-group>

		<p
			v-else-if="!isLoading"
			class="w-full bg-quaternary p-5 text-center font-semibold uppercase"
		>
			Aucune news trouvée
		</p>

		<div v-if="filteredNewsList.length > 0" class="mt-4 text-center text-xs">
			<p>{{ filteredNewsList.length }} news au total - Page {{ page }}/{{ nbPage }}</p>
		</div>
	</div>
</template>

<style scoped>
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
