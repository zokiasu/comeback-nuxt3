<script setup lang="ts">
	import VueDatePicker from '@vuepic/vue-datepicker'
	import '@vuepic/vue-datepicker/dist/main.css'
	import { useToast } from 'vue-toastification'
	import debounce from 'lodash.debounce'
	import algoliasearch from 'algoliasearch/lite'
	import type { News } from '~/types/supabase/news'
	import { useSupabaseNews } from '~/composables/Supabase/useSupabaseNews'

	const emit = defineEmits(['closeModal'])

	const toast = useToast()
	const config = useRuntimeConfig()
	const { createNews } = useSupabaseNews()
	const client = algoliasearch(
		config.public.ALGOLIA_APPLICATION_ID,
		config.public.ALGOLIA_API_KEY,
	)
	const index = client.initIndex('ARTISTS')

	const sendNews = ref<boolean>(false)
	const searchArtist = ref<string>('')
	const artistListSearched = ref<any[]>([])

	const artistListSelected = ref<any[]>([])
	const newsDate = ref<Date | null>(null)
	const newsMessage = ref<string>('')

	// Définition d'une fonction de recherche débattue
	const debouncedSearch = debounce(async (query) => {
		try {
			const { hits } = await index.search(query)
			artistListSearched.value = hits.slice(0, 10)
		} catch (error) {
			console.error('Erreur lors de la recherche:', error)
		}
	}, 500)

	const creationNews = async () => {
		const news: Omit<News, 'id' | 'artists' | 'created_at' | 'updated_at'> = {
			date: newsDate.value?.toISOString() ?? new Date().toISOString(),
			message: newsMessage.value,
			verified: false,
		}
		sendNews.value = true
    
    // Extraire uniquement les IDs des artistes
    const artistIds = artistListSelected.value.map(artist => artist.id)
		
		createNews(news, artistIds).then((res) => {
			toast.success('News created')
			sendNews.value = false
			closeModal()
		}).catch((error) => {
			toast.error('Error creating news')
			console.error('Error creating news', error)
		})
	}

	const addArtistToNews = (artist: any) => {
		artistListSelected.value.push({
			id: artist.objectID,
			name: artist.name,
			picture: artist.image,
		})
		clearSearch()
	}

	const removeArtistFromNews = (artist: any) => {
		artistListSelected.value = artistListSelected.value.filter((a) => a.id !== artist.id)
	}

	const clearSearch = () => {
		searchArtist.value = ''
		artistListSearched.value = []
	}

	const closeModal = () => {
		emit('closeModal')
	}

	watchEffect(() => {
		if (searchArtist.value.length > 2) {
			debouncedSearch(searchArtist.value)
		} else {
			artistListSearched.value = []
		}
	})

	watch(newsDate, (newVal) => {
		if (newVal) {
			newsMessage.value = `Next comeback on ${newVal.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
		}
	})
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

		<div v-if="artistListSelected.length" class="flex flex-col gap-1">
			<ComebackLabel label="Artist(s)" />
			<div class="flex flex-wrap gap-5">
				<div
					v-for="artist in artistListSelected"
					:key="artist.id"
					@click="removeArtistFromNews(artist)"
					class="flex flex-col justify-center items-center px-5 relative hover:bg-red-500/50 rounded py-1 cursor-pointer"
				>
					<img :src="artist.picture" class="h-8 w-8 rounded-full object-cover" />
					<p>{{ artist.name }}</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-1">
			<ComebackLabel label="Date" />
			<VueDatePicker
				v-model="newsDate"
				placeholder="Select Date"
				auto-apply
				:enable-time-picker="false"
				dark
			/>
		</div>

		<div class="flex flex-col gap-1">
			<ComebackInput
				v-model="newsMessage"
				label="Your News"
				placeholder="Your News"
				@clear="newsMessage = ''"
			/>
		</div>

		<button
			:disabled="sendNews"
			class="w-full rounded bg-primary py-2 font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
			@click="creationNews"
		>
			<p v-if="sendNews">Sending...</p>
			<p v-else>Send News</p>
		</button>
	</div>
</template>
