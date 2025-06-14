<template>
	<div class="container mx-auto space-y-5 p-5">
		<div class="space-y-2">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				<UInput
					v-model="search"
					placeholder="Recherche par nom de musique"
				/>
				<ArtistAlgoliaSelect v-model="selectedArtist" class="" />
			</div>
			<div class="flex justify-between">
				<div class="flex gap-2">
					<UInput
						v-model="selectedYear"
						placeholder="Année (ex: 2024)"
						type="number"
					/>
					<UButton @click="loadMusicsByYear" class="cb_button h-full">Rechercher</UButton>
					<UButton @click="resetFilters" color="secondary" variant="outline">Réinitialiser</UButton>
				</div>
				<div v-if="musicData.total > 0" class="flex justify-center">
					<UPagination
						v-model:page="currentPage"
						:total="musicData.total"
						:items-per-page="musicData.limit"
						:disabled="loading"
						@update:page="loadMusicsByYear"
					/>
				</div>
			</div>
			<UCheckbox
				v-model="isMv"
				label="Afficher uniquement les clips (isMv)"
				class=""
			/>
		</div>
		<div v-if="loading">Chargement...</div>
		<div v-else class="space-y-2">
			<p class="text-xs text-cb-tertiary-500">Liste des musiques pour {{ selectedYear ? selectedYear : 'toutes les années' }} ({{ musicData.total }} résultats)</p>
			<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
				<MusicDisplay
					v-for="music in musicData.musics"
					:key="music.id"
					:music-id="music.id_youtube_music"
					:music-name="music.name"
					:artist-name="formatArtists(music.artists)"
					:music-image="music.thumbnails?.[2]?.url || ''"
					:duration="music.duration || 0"
					:ismv="music.ismv"
					class="bg-cb-quinary-900 w-full"
				/>
			</section>
			<!-- <div v-for="music in musicData.musics" :key="music.id" class="mb-4 p-4 border rounded">
				<h3>{{ music.name }}</h3>
				<p>Artistes: {{ formatArtists(music.artists) }}</p>
				<p>Type: {{ music.type }}</p>
			</div> -->
		</div>
		<!-- Pagination -->
		<div v-if="musicData.total > 0" class="flex justify-center">
			<UPagination
				v-model:page="currentPage"
				:total="musicData.total"
				:items-per-page="musicData.limit"
				:disabled="loading"
				@update:page="loadMusicsByYear"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSupabaseMusic } from '~/composables/Supabase/useSupabaseMusic'
import type { Music } from '~/types'
import ArtistAlgoliaSelect from '~/components/ArtistAlgoliaSelect.vue'
import { onMounted } from 'vue'

type MusicWithArtists = Music & { artists: { name: string }[] }

const { getMusicsByPage } = useSupabaseMusic()

const search = ref('')
const selectedArtist = ref<any | null>(null)
const isMv = ref<boolean | undefined>(undefined)
const selectedYear = ref<number | undefined>(undefined)
const currentPage = ref(1)
const loading = ref(false)
const musicData = ref<any>({
	musics: [],
	total: 0,
	page: 1,
	limit: 20,
	totalPages: 0,
})

const loadMusicsByYear = async () => {
	loading.value = true
	try {
		const result = await getMusicsByPage(currentPage.value, musicData.value.limit, {
			search: search.value || undefined,
			artistId: selectedArtist.value?.objectID || undefined,
			year: selectedYear.value || undefined,
			orderBy: 'created_at',
			orderDirection: 'desc',
			ismv: isMv.value !== undefined ? isMv.value : undefined,
		})
		console.log('result', result)
		musicData.value = {
			...result,
			musics: result.musics.map(m => ({
				...m,
				artists: Array.isArray((m as any).artists) ? (m as any).artists : [],
			}))
		}
	} catch (error) {
		console.error('Erreur lors du chargement des musiques:', error)
	} finally {
		loading.value = false
	}
}

function formatArtists(artists: { name: string }[] = []) {
	return artists.map(a => a.name).join(', ')
}

function resetFilters() {
	search.value = ''
	selectedArtist.value = null
	isMv.value = undefined
	selectedYear.value = undefined
	currentPage.value = 1
	loadMusicsByYear()
}

// Charger les musiques au montage
onMounted(() => {
	currentPage.value = 1
	loadMusicsByYear()
})
</script>