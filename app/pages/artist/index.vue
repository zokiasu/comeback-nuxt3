
<template>
	<div class="container mx-auto py-10">
		<div class="mb-4 flex flex-col gap-4">
			<UInput
				v-model="search"
				type="text"
				placeholder="Search for an artist..."
				class="mb-2 w-full"
			/>
			<div>
				<p class="mb-2 text-white">Filtrer par tags :</p>
				<div v-if="tagsList.length > 0" class="flex flex-wrap gap-2">
					<button
						v-for="tag in tagsList"
						:key="tag.id"
						@click="toggleTag(tag.name)"
						:disabled="isLoading"
						:class="[
							'cursor-pointer rounded border px-3 py-1 text-xs font-medium text-white transition',
							selectedTags.includes(tag.name)
								? 'bg-cb-primary-900 border-cb-primary-900'
								: 'bg-cb-quinary-900 border-cb-quinary-900 hover:bg-cb-primary-800',
							isLoading ? 'cursor-not-allowed opacity-50' : '',
						]"
						type="button"
					>
						{{ tag.name }}
					</button>
				</div>
			</div>
			<div>
				<p class="mb-2 text-white">Filtrer par type :</p>
				<div class="mb-2 flex flex-wrap gap-2">
					<button
						v-for="type in artistTypes"
						:key="type"
						@click="selectedType = selectedType === type ? null : type"
						:class="[
							'cursor-pointer rounded border px-3 py-1 text-xs font-medium text-white transition',
							selectedType === type
								? 'bg-cb-primary-900 border-cb-primary-900'
								: 'bg-cb-quinary-900 border-cb-quinary-900 hover:bg-cb-primary-800',
							isLoading ? 'cursor-not-allowed opacity-50' : '',
						]"
						:disabled="isLoading"
						type="button"
					>
						{{ type }}
					</button>
				</div>
			</div>
			<div>
				<p class="mb-2 text-white">Filtrer par styles :</p>
				<div v-if="stylesList.length > 0" class="mb-4 flex flex-wrap gap-2">
					<button
						v-for="style in stylesList"
						:key="style.id"
						@click="toggleStyle(style.name)"
						:class="[
							'cursor-pointer rounded border px-3 py-1 text-xs font-medium text-white transition',
							selectedStyles.includes(style.name)
								? 'bg-cb-primary-900 border-cb-primary-900'
								: 'bg-cb-quinary-900 border-cb-quinary-900 hover:bg-cb-primary-800',
							isLoading ? 'cursor-not-allowed opacity-50' : '',
						]"
						:disabled="isLoading"
						type="button"
					>
						{{ style.name }}
					</button>
				</div>
			</div>
			<div>
				<p class="mb-2 text-white">Filtrer par genre :</p>
				<div class="mb-2 flex flex-wrap gap-2">
					<button
						v-for="gender in genderList"
						:key="gender"
						@click="toggleGender(gender)"
						:class="[
							'cursor-pointer rounded border px-3 py-1 text-xs font-medium text-white transition',
							selectedGender === gender
								? 'bg-cb-primary-900 border-cb-primary-900'
								: 'bg-cb-quinary-900 border-cb-quinary-900 hover:bg-cb-primary-800',
							isLoading ? 'cursor-not-allowed opacity-50' : '',
						]"
						:disabled="isLoading"
						type="button"
					>
						{{ gender }}
					</button>
				</div>
			</div>
		</div>
		<transition-group
			tag="div"
			leave-active-class="animate__bounceOut"
			enter-active-class="animate__bounceIn"
			class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3.5 lg:grid-cols-6 xl:grid-cols-8"
		>
			<CardObject
				v-for="artist in artists"
				:key="artist.id"
				is-artist
				:artist-id="artist.id"
				:main-title="artist.name"
				:image="artist.image || ''"
				:release-date="artist.debut_date || ''"
				:release-type="artist.type || ''"
				:object-link="`/artist/${artist.id}`"
				date-always-display
				class="!min-w-full"
			/>
		</transition-group>
		<div v-if="isLoading" class="py-4 text-center">Chargement...</div>
		<div v-if="!hasMore && artists.length > 0" class="py-4 text-center text-gray-400">
			Tous les artistes sont affichés.
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, onMounted } from 'vue'
	import { useSupabaseArtist } from '@/composables/Supabase/useSupabaseArtist'
	import { useSupabaseGeneralTags } from '@/composables/Supabase/useSupabaseGeneralTags'
	import { useSupabaseMusicStyles } from '@/composables/Supabase/useSupabaseMusicStyles'
	import { useInfiniteScroll } from '@vueuse/core'
	import type { Artist, GeneralTag, MusicStyle } from '~/types'

	const { getArtistsByPage } = useSupabaseArtist()
	const { getAllGeneralTags } = useSupabaseGeneralTags()
	const { getAllMusicStyles } = useSupabaseMusicStyles()

	const artists = ref<Artist[]>([])
	const search = ref('')
	const page = ref(1)
	const limit = ref(48)
	const isLoading = ref(false)
	const hasMore = ref(true)

	const tagsList = ref<GeneralTag[]>([])
	const selectedTags = ref<string[]>([])
	const artistTypes = ['SOLO', 'GROUP']
	const selectedType = ref<string | null>(null)
	const stylesList = ref<MusicStyle[]>([])
	const selectedStyles = ref<string[]>([])
	const genderList = ['MALE', 'FEMALE', 'MIXTE', 'OTHER', 'UNKNOWN']
	const selectedGender = ref<string | null>(null)

	const fetchArtists = async (reset = false) => {
		if (isLoading.value || (!hasMore.value && !reset)) return
		isLoading.value = true
		const result = await getArtistsByPage(page.value, limit.value, {
			search: search.value,
			general_tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
			type: selectedType.value || undefined,
			styles: selectedStyles.value.length > 0 ? selectedStyles.value : undefined,
			gender: selectedGender.value || undefined,
		})
		const artistsArray = Array.isArray(result.artists) ? result.artists : []
		if (reset) {
			artists.value = artistsArray
		} else {
			artists.value = [...artists.value, ...artistsArray]
		}
		hasMore.value = artistsArray.length === limit.value
		isLoading.value = false
	}

	watch([search, selectedTags, selectedType, selectedStyles, selectedGender], () => {
		console.log(
			'Watcher déclenché',
			selectedTags.value,
			selectedType.value,
			selectedStyles.value,
			selectedGender.value,
		)
		page.value = 1
		hasMore.value = true
		fetchArtists(true)
	})

	const loadMore = async () => {
		if (isLoading.value || !hasMore.value) return
		page.value++
		await fetchArtists()
	}

	onMounted(async () => {
		tagsList.value = await getAllGeneralTags()
		stylesList.value = await getAllMusicStyles()
		fetchArtists(true)
	})

	useInfiniteScroll(window, loadMore, {
		distance: 200,
		canLoadMore: () => hasMore.value && !isLoading.value,
	})

	const toggleTag = (tagName: string) => {
		if (selectedTags.value.includes(tagName)) {
			selectedTags.value = selectedTags.value.filter((t) => t !== tagName)
		} else {
			selectedTags.value = [...selectedTags.value, tagName]
		}
	}

	const toggleStyle = (styleName: string) => {
		if (selectedStyles.value.includes(styleName)) {
			selectedStyles.value = selectedStyles.value.filter((s) => s !== styleName)
		} else {
			selectedStyles.value = [...selectedStyles.value, styleName]
		}
	}

	const toggleGender = (gender: string) => {
		if (selectedGender.value === gender) {
			selectedGender.value = null
		} else {
			selectedGender.value = gender
		}
	}

	definePageMeta({
		middleware: ['auth'],
	})
</script>
