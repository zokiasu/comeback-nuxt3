<template>
	<div class="space-y-6">
		<div class="border-b border-gray-200 dark:border-gray-700 pb-4">
			<h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
				Ajouter des musiques
			</h4>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Recherchez des musiques existantes ou créez-en de nouvelles
			</p>
		</div>

		<!-- Onglets -->
		<UTabs 
			:items="tabItems" 
			v-model="activeTab"
			class="w-full"
		>
			<!-- Recherche de musiques existantes -->
			<template #search>
				<div class="space-y-4">
					<UInputMenu
						v-model="selectedMusic"
						:search="searchMusics"
						:items="musicOptions"
						option-attribute="name"
						placeholder="Rechercher une musique existante..."
						:loading="isSearching"
						:disabled="loading"
						size="lg"
						@update:model-value="onMusicSelected"
					>
						<template #option="{ option }">
							<div class="flex items-center justify-between w-full">
								<div class="flex items-center space-x-3 flex-1 min-w-0">
									<div class="flex-shrink-0">
										<div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
											<UIcon name="i-heroicons-musical-note" class="w-5 h-5 text-white" />
										</div>
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
											{{ option.name }}
										</p>
										<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
											{{ formatArtists(option.artists) }}
											<span v-if="option.duration" class="ml-2">
												• {{ formatDuration(option.duration) }}
											</span>
										</p>
									</div>
								</div>
								<div class="flex-shrink-0 ml-2">
									<UBadge
										:label="option.type || 'TRACK'"
										variant="soft"
										size="xs"
									/>
								</div>
							</div>
						</template>

						<template #option-empty="{ query }">
							<div class="flex flex-col items-center justify-center py-6 text-sm text-gray-500 dark:text-gray-400">
								<UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 mb-2" />
								<span v-if="query">Aucune musique trouvée pour "{{ query }}"</span>
								<span v-else>Tapez pour rechercher une musique</span>
							</div>
						</template>
					</UInputMenu>

					<div v-if="selectedMusic" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
								<div>
									<p class="text-sm font-medium text-green-800 dark:text-green-200">
										{{ selectedMusic.name }}
									</p>
									<p class="text-xs text-green-600 dark:text-green-400">
										Prête à être ajoutée à la release
									</p>
								</div>
							</div>
							<UButton
								@click="addExistingMusic"
								:loading="loading"
								size="sm"
							>
								Ajouter
							</UButton>
						</div>
					</div>
				</div>
			</template>

			<!-- Création de nouvelle musique -->
			<template #create>
				<UForm
					:schema="musicSchema"
					:state="newMusicForm"
					@submit="createAndAddMusic"
					class="space-y-4"
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<UFormField label="Titre de la musique" name="name" required>
							<UInput
								v-model="newMusicForm.name"
								placeholder="Ex: Nouvelle chanson"
								:disabled="loading"
							/>
						</UFormField>

						<UFormField label="Type" name="type">
							<USelect
								v-model="newMusicForm.type"
								:items="musicTypeOptions"
								:disabled="loading"
							/>
						</UFormField>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<UFormField label="Durée (secondes)" name="duration">
							<UInput
								v-model.number="newMusicForm.duration"
								type="number"
								min="1"
								placeholder="Ex: 180"
								:disabled="loading"
							/>
						</UFormField>

						<UFormField label="Langue" name="language">
							<USelect
								v-model="newMusicForm.language"
								:items="languageOptions"
								:disabled="loading"
							/>
						</UFormField>
					</div>

					<!-- IDs externes optionnels -->
					<UAccordion 
						:items="[{ label: 'Informations avancées (optionnel)', slot: 'advanced' }]"
						variant="soft"
					>
						<template #advanced>
							<div class="space-y-4 pt-4">
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<UFormField label="ID YouTube Music" name="id_youtube_music">
										<UInput
											v-model="newMusicForm.id_youtube_music"
											placeholder="Ex: MLwTVTTVnU"
											:disabled="loading"
										/>
									</UFormField>

									<UFormField label="ID Spotify" name="id_spotify">
										<UInput
											v-model="newMusicForm.id_spotify"
											placeholder="Ex: 4uLU6hMCjMI75M1A2tKUQC"
											:disabled="loading"
										/>
									</UFormField>
								</div>

								<UFormField label="Lien YouTube" name="youtube_link">
									<UInput
										v-model="newMusicForm.youtube_link"
										placeholder="https://www.youtube.com/watch?v=..."
										:disabled="loading"
									/>
								</UFormField>

								<UFormField label="Description" name="description">
									<UTextarea
										v-model="newMusicForm.description"
										placeholder="Description de la musique..."
										:disabled="loading"
										:rows="3"
									/>
								</UFormField>

								<UCheckbox
									v-model="newMusicForm.ismv"
									label="C'est un clip vidéo (MV)"
									:disabled="loading"
								/>

								<UCheckbox
									v-model="newMusicForm.verified"
									label="Marquer comme vérifiée"
									:disabled="loading"
								/>
							</div>
						</template>
					</UAccordion>

					<div class="flex justify-end space-x-3 pt-4">
						<UButton
							type="button"
							color="gray"
							variant="soft"
							@click="resetNewMusicForm"
							:disabled="loading"
						>
							Réinitialiser
						</UButton>
						<UButton
							type="submit"
							:loading="loading"
							icon="i-heroicons-plus"
						>
							Créer et ajouter
						</UButton>
					</div>
				</UForm>
			</template>
		</UTabs>
	</div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Music } from '~/types'

// Props
interface Props {
	releaseId: string
	artistId: string
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false
})

// Emits
const emit = defineEmits<{
	'music-added': [music: Music]
	'music-created': [music: Music]
}>()

// Composables
const { getAllMusics, createMusic } = useSupabaseMusic()
const toast = useToast()

// Schema de validation
const musicSchema = z.object({
	name: z.string().min(1, 'Le titre est requis'),
	type: z.enum(['TRACK', 'INSTRUMENTAL', 'REMIX', 'LIVE', 'ACOUSTIC']).optional(),
	duration: z.number().min(1).optional(),
	language: z.string().optional(),
	id_youtube_music: z.string().optional(),
	id_spotify: z.string().optional(),
	youtube_link: z.string().url().optional().or(z.literal('')),
	description: z.string().optional(),
	ismv: z.boolean().default(false),
	verified: z.boolean().default(false)
})

// Onglets
const tabItems = [
	{
		key: 'search',
		label: 'Rechercher',
		description: 'Musiques existantes'
	},
	{
		key: 'create',
		label: 'Créer',
		description: 'Nouvelle musique'
	}
]

// État
const activeTab = ref(0)
const isSearching = ref(false)
const selectedMusic = ref<Music | null>(null)
const musicOptions = ref<Music[]>([])
const searchQuery = ref('')

// Formulaire de création de musique
const newMusicForm = reactive({
	name: '',
	type: 'TRACK' as const,
	duration: undefined as number | undefined,
	language: 'KO',
	id_youtube_music: '',
	id_spotify: '',
	youtube_link: '',
	description: '',
	ismv: false,
	verified: false
})

// Options
const musicTypeOptions = [
	{ label: 'Titre', value: 'TRACK' },
	{ label: 'Instrumental', value: 'INSTRUMENTAL' },
	{ label: 'Remix', value: 'REMIX' },
	{ label: 'Live', value: 'LIVE' },
	{ label: 'Acoustique', value: 'ACOUSTIC' }
]

const languageOptions = [
	{ label: 'Coréen', value: 'KO' },
	{ label: 'Anglais', value: 'EN' },
	{ label: 'Japonais', value: 'JP' },
	{ label: 'Chinois', value: 'ZH' },
	{ label: 'Français', value: 'FR' },
	{ label: 'Espagnol', value: 'ES' },
	{ label: 'Autre', value: 'OTHER' }
]

// Fonctions utilitaires
const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatArtists = (artists: any[]) => {
	if (!artists || artists.length === 0) return 'Artiste inconnu'
	return artists.map(a => a.artist?.name || a.name).join(', ')
}

// Recherche de musiques
const searchMusics = async (query: string) => {
	if (!query || query.length < 2) {
		musicOptions.value = []
		return []
	}

	isSearching.value = true
	searchQuery.value = query
	
	try {
		const musics = await getAllMusics({
			search: query,
			limit: 10,
			orderBy: 'name',
			orderDirection: 'asc'
		})
		
		musicOptions.value = musics
		return musics
	} catch (error) {
		console.error('Erreur lors de la recherche de musiques:', error)
		return []
	} finally {
		isSearching.value = false
	}
}

// Sélection de musique
const onMusicSelected = (music: Music | null) => {
	selectedMusic.value = music
}

// Ajouter une musique existante
const addExistingMusic = () => {
	if (selectedMusic.value) {
		emit('music-added', selectedMusic.value)
		selectedMusic.value = null
	}
}

// Créer et ajouter une nouvelle musique
const createAndAddMusic = async () => {
	try {
		const musicData = {
			name: newMusicForm.name.trim(),
			type: newMusicForm.type,
			duration: newMusicForm.duration || null,
			language: newMusicForm.language || null,
			id_youtube_music: newMusicForm.id_youtube_music || null,
			id_spotify: newMusicForm.id_spotify || null,
			youtube_link: newMusicForm.youtube_link || null,
			description: newMusicForm.description || null,
			ismv: newMusicForm.ismv,
			verified: newMusicForm.verified,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}

		const createdMusic = await createMusic(musicData, [props.artistId])
		
		if (createdMusic) {
			emit('music-created', createdMusic)
			resetNewMusicForm()
			
			toast.add({
				title: 'Musique créée avec succès',
				description: `"${createdMusic.name}" a été créée.`,
				color: 'success'
			})
		}
	} catch (error) {
		console.error('Erreur lors de la création de la musique:', error)
		toast.add({
			title: 'Erreur lors de la création',
			description: 'Une erreur est survenue lors de la création de la musique.',
			color: 'error'
		})
	}
}

// Réinitialiser le formulaire
const resetNewMusicForm = () => {
	Object.assign(newMusicForm, {
		name: '',
		type: 'TRACK',
		duration: undefined,
		language: 'KO',
		id_youtube_music: '',
		id_spotify: '',
		youtube_link: '',
		description: '',
		ismv: false,
		verified: false
	})
}
</script> 