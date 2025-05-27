<script setup lang="ts">
	import { CalendarDate } from '@internationalized/date'
	import algoliasearch from 'algoliasearch/lite'
	import type { Artist } from '~/types/supabase/artist'
	import { useSupabaseNews } from '~/composables/Supabase/useSupabaseNews'
	import { useDebounce } from '~/composables/useDebounce'

	const toast = useToast()
	const config = useRuntimeConfig()
	const { updateNews, updateNewsArtistsRelations } = useSupabaseNews()
	const client = algoliasearch(
		config.public.ALGOLIA_APPLICATION_ID,
		config.public.ALGOLIA_API_KEY,
	)
	const index = client.initIndex('ARTISTS')

	const { id, message, artists, date, user, verified } = defineProps({
		id: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		artists: {
			type: Array as PropType<Artist[]>,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		user: {
			type: Object,
			required: true,
		},
		verified: {
			type: Boolean,
			required: true,
		},
	})

	const skeleton = useTemplateRef('skeleton')
	const isEditModalOpen = ref(false)
	const isUpdating = ref(false)
	const searchArtist = ref<string>('')
	const artistListSearched = ref<any[]>([])
	const artistListSelected = ref<any[]>([])
	const editNewsDate = ref<Date | null>(null)
	const editNewsMessage = ref<string>('')

	// Initialiser les valeurs d'édition avec les valeurs actuelles
	const initEditForm = () => {
		editNewsDate.value = date ? new Date(date) : null
		editNewsMessage.value = message || ''
		artistListSelected.value = artists.map((artist) => ({
			id: artist.id,
			name: artist.name,
			picture: artist.image,
		}))
	}

	const parseToCalendarDate = (date: Date | null | undefined): CalendarDate | null => {
		if (!date) return null
		try {
			const year = date.getUTCFullYear()
			const month = date.getUTCMonth() + 1
			const day = date.getUTCDate()
			return new CalendarDate(year, month, day)
		} catch (e) {
			console.error('Failed to parse date:', date, e)
			return null
		}
	}

	// Recherche d'artistes débouncée
	const debouncedSearch = useDebounce(async (query) => {
		try {
			const { hits } = await index.search(query)
			artistListSearched.value = hits.slice(0, 10)
		} catch (error) {
			console.error('Erreur lors de la recherche:', error)
		}
	}, 500)

	// Mise à jour de la news
	const updateNewsData = async () => {
		isUpdating.value = true
		try {
			// Mise à jour des données de base de la news
			const updatedNews = await updateNews(id, {
				date: editNewsDate.value?.toISOString() ?? date,
				message: editNewsMessage.value,
			})

			// Mise à jour des relations avec les artistes
			const artistIds = artistListSelected.value.map((artist) => artist.id)
			await updateNewsArtistsRelations(id, artistIds)

			toast.add({
				title: 'Succès',
				description: 'News mise à jour avec succès',
				color: 'success',
			})

			// Émettre un événement pour mettre à jour la liste des news
			emit('updateNews', {
				id,
				message: editNewsMessage.value,
				date: editNewsDate.value?.toISOString() ?? date,
				artists: artistListSelected.value.map((artist) => ({
					id: artist.id,
					name: artist.name,
					image: artist.picture,
				})),
				verified,
				user,
			})

			closeEditModal()
		} catch (error) {
			console.error('Erreur lors de la mise à jour de la news:', error)
			toast.add({
				title: 'Erreur',
				description: 'Erreur lors de la mise à jour de la news',
				color: 'error',
			})
		} finally {
			isUpdating.value = false
		}
	}

	const addArtistToNews = (artist: any) => {
		// Éviter les doublons
		if (!artistListSelected.value.some((a) => a.id === artist.objectID)) {
			artistListSelected.value.push({
				id: artist.objectID,
				name: artist.name,
				picture: artist.image,
			})
		}
		clearSearch()
	}

	const removeArtistFromNews = (artist: any) => {
		artistListSelected.value = artistListSelected.value.filter((a) => a.id !== artist.id)
	}

	const clearSearch = () => {
		searchArtist.value = ''
		artistListSearched.value = []
	}

	const openEditModal = () => {
		initEditForm()
		isEditModalOpen.value = true
	}

	const closeEditModal = () => {
		isEditModalOpen.value = false
		clearSearch()
	}

	watchEffect(() => {
		if (searchArtist.value.length > 2) {
			debouncedSearch(searchArtist.value)
		} else {
			artistListSearched.value = []
		}
	})

	const loadingDone = () => {
		if (skeleton.value) skeleton.value.classList.add('opacity-0')
	}

	const convertDate = (timestamp: string) => {
		const date = new Date(timestamp)
		return date.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const emit = defineEmits(['deleteNews', 'updateNews'])

	const deleteNews = () => {
		emit('deleteNews', id)
	}
</script>

<template>
	<div
		class="list-complete-item bg-cb-quaternary-950 relative h-full space-y-2.5 rounded p-3"
	>
		<div class="grid grid-cols-3 gap-2">
			<div
				v-for="artistObject in artists"
				:key="artistObject.id"
				class="bg-cb-quinary-900 flex w-full flex-col items-center justify-center overflow-hidden rounded"
			>
				<NuxtImg
					:src="artistObject.image"
					:alt="artistObject.name"
					format="webp"
					loading="lazy"
					class="h-10 w-full object-cover"
					@load="loadingDone"
				/>
				<p class="px-2 py-1">{{ artistObject.name }}</p>
			</div>
		</div>

		<div>
			<ComebackLabel label="Message" class="border-b border-zinc-500" />
			<p>{{ message }}</p>
		</div>

		<div>
			<ComebackLabel label="Date" class="border-b border-zinc-500" />
			<p>{{ convertDate(date) }}</p>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<button
				class="bg-cb-quinary-900 hover:bg-cb-tertiary-200/30 rounded px-3 py-1 transition-all duration-300 ease-in-out"
				@click="openEditModal"
			>
				Edit
			</button>
			<button
				class="bg-cb-quinary-900 hover:bg-cb-tertiary-200/30 rounded px-3 py-1 transition-all duration-300 ease-in-out"
				@click="deleteNews"
			>
				Delete
			</button>
		</div>

		<!-- Modal d'édition -->
		<UModal
			v-model:open="isEditModalOpen"
			:ui="{
				overlay: 'bg-cb-quinary-950/75',
				content: 'ring-cb-quinary-950',
			}"
		>
			<template #content>
				<div class="bg-cb-secondary-950 space-y-5 p-5">
					<h3 class="text-2xl font-bold">Modifier Comeback</h3>
					<div class="relative">
						<ComebackInput
							v-model="searchArtist"
							label="Sélectionner artiste(s)"
							placeholder="Rechercher un artiste"
							@clear="clearSearch"
						/>
						<div
							v-if="artistListSearched.length"
							class="scrollBarLight oversc bg-cb-quaternary-950 absolute top-18 z-10 flex h-40 w-full flex-col justify-start overflow-hidden overflow-y-auto p-1"
						>
							<button
								v-for="artist in artistListSearched"
								:key="artist.id"
								class="hover:bg-cb-quinary-900 rounded p-2 text-start"
								@click="addArtistToNews(artist)"
							>
								{{ artist.name }}
							</button>
						</div>
					</div>

					<div v-if="artistListSelected.length" class="flex flex-col gap-1">
						<ComebackLabel label="Artiste(s)" />
						<div class="flex flex-wrap gap-5">
							<div
								v-for="artist in artistListSelected"
								:key="artist.id"
								class="relative flex cursor-pointer flex-col items-center justify-center rounded px-5 py-1 hover:bg-red-500/50"
								@click="removeArtistFromNews(artist)"
							>
								<img :src="artist.picture" class="h-8 w-8 rounded-full object-cover" />
								<p>{{ artist.name }}</p>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-1">
						<ComebackLabel label="Date" />
						<UCalendar
							class="bg-cb-quinary-900 rounded p-1"
							:model-value="parseToCalendarDate(editNewsDate)"
							:min-date="new Date(1900, 0, 1)"
							@update:model-value="
								(value) => {
									if (value) {
										editNewsDate = new Date(value.toString())
									} else {
										editNewsDate = null
									}
								}
							"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<ComebackInput
							v-model="editNewsMessage"
							label="Message"
							placeholder="Votre message"
							@clear="editNewsMessage = ''"
						/>
					</div>

					<div class="flex gap-3">
						<button
							class="bg-cb-quinary-900 hover:bg-cb-tertiary-200/30 flex-1 rounded py-2 font-semibold uppercase transition-all duration-300 ease-in-out"
							@click="closeEditModal"
						>
							Annuler
						</button>
						<button
							:disabled="isUpdating"
							class="bg-cb-primary-900 flex-1 rounded py-2 font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
							@click="updateNewsData"
						>
							<p v-if="isUpdating">Mise à jour...</p>
							<p v-else>Mettre à jour</p>
						</button>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>
