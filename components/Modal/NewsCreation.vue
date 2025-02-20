<script setup>
	import VueDatePicker from '@vuepic/vue-datepicker'
	import '@vuepic/vue-datepicker/dist/main.css'
	import { Timestamp } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import debounce from 'lodash.debounce'
	import algoliasearch from 'algoliasearch/lite'
	import { useUserStore } from '@/stores/user'

	const config = useRuntimeConfig()
	const client = algoliasearch(
		config.public.ALGOLIA_APPLICATION_ID,
		config.public.ALGOLIA_API_KEY,
	)
	const index = client.initIndex('Artists')

	const { userDataStore } = useUserStore()
	const toast = useToast()

	const emit = defineEmits(['closeModal'])

	const dateToDateFormat = ref(null)
	const sendNews = ref(false)
	const searchArtist = ref('')
	const artistListSearched = ref([])

	const news = ref({
		artists: [],
		user: {
			id: userDataStore.id,
			name: userDataStore.name,
			picture: userDataStore.picture,
		},
		date: null,
		message: null,
		verified: false,
		createdAt: Timestamp.fromDate(new Date()),
		updatedAt: Timestamp.fromDate(new Date()),
	})

	// Définition d'une fonction de recherche débattue
	const debouncedSearch = debounce(async (query) => {
		console.log('Searching for:', query)
		try {
			const { hits } = await index.search(query)
			console.log('Search results:', hits)
			artistListSearched.value = hits.slice(0, 10)
		} catch (error) {
			console.error('Erreur lors de la recherche:', error)
		}
	}, 500)

	watchEffect(() => {
		if (searchArtist.value.length > 2) {
			console.log('Triggering search for:', searchArtist.value)
			debouncedSearch(searchArtist.value)
		} else {
			artistListSearched.value = []
		}
	})

	watch([dateToDateFormat], () => {
		if (!dateToDateFormat.value) return
		const tmpDate = new Date(dateToDateFormat.value)
		tmpDate.setHours(0, 0, 0, 0)
		news.value.date = Timestamp.fromDate(tmpDate)
		news.value.message = `Next comeback on ${new Date(
			dateToDateFormat.value,
		).toLocaleDateString()}`
	})

	const closeModal = () => {
		emit('closeModal')
	}

	const createNews = async () => {
		// if (await getComebackExist(news.value.date, news.value.artist.name)) {
		//   toast.error('Comeback already exist')
		//   closeModal()
		//   return
		// }

		sendNews.value = true

		add('news', news.value)
			.then(() => {
				news.value = {
					artists: [],
					user: {
						id: userDataStore.id,
						name: userDataStore.name,
						image: userDataStore.picture,
					},
					date: null,
					message: null,
					verified: false,
					createdAt: Timestamp.fromDate(new Date()),
					updatedAt: Timestamp.fromDate(new Date()),
				}
				dateToDateFormat.value = null
				toast.success('News created')
				sendNews.value = false
				closeModal()
			})
			.catch((error) => {
				sendNews.value = false
				console.error('Error adding document: ', error)
				toast.error('Error creating news')
			})
	}

	const addArtistToNews = (artist) => {
		news.value.artists.push({
			id: artist.id,
			name: artist.name,
			picture: artist.image,
		})
		searchArtist.value = ''
		artistListSearched.value = []
	}

	const clearSearch = () => {
		searchArtist.value = ''
		artistListSearched.value = []
	}
</script>

<template>
	<div class="space-y-5 py-2">
		<div class="relative">
			<ComebackInput
				v-model="searchArtist"
				label="Select artist(s)"
				placeholder="Search Artist"
				@clear="clearSearch"
			/>
			<div
				v-if="artistListSearched.length"
				class="scrollBarLight oversc top-18 absolute z-10 flex h-40 w-full flex-col justify-start overflow-hidden overflow-y-auto bg-quaternary p-1"
			>
				<button
					v-for="artist in artistListSearched"
					:key="artist.id"
					class="rounded p-2 text-start hover:bg-quinary"
					@click="addArtistToNews(artist)"
				>
					{{ artist.name }}
				</button>
			</div>
		</div>
		<div v-if="news.artists.length" class="flex flex-col gap-1">
			<ComebackLabel label="Artist(s)" />
			<div class="flex flex-wrap gap-5">
				<div
					v-for="artist in news.artists"
					:key="artist.id"
					class="flex items-center gap-3"
				>
					<img :src="artist.picture" class="h-8 w-8 rounded-full object-cover" />
					<p>{{ artist.name }}</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<ComebackLabel label="Date" />
			<VueDatePicker
				v-model="dateToDateFormat"
				placeholder="Select Date"
				auto-apply
				:enable-time-picker="false"
				dark
			/>
		</div>
		<div class="flex flex-col gap-1">
			<ComebackInput
				v-model="news.message"
				label="Your News"
				placeholder="Your News"
				@clear="news.message = ''"
			/>
		</div>
		<button
			:disabled="sendNews"
			class="w-full rounded bg-primary py-2 font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
			@click="createNews"
		>
			<p v-if="sendNews">Sending...</p>
			<p v-else>Send News</p>
		</button>
	</div>
</template>
