<script setup lang="ts">
	import { ref, watchEffect } from 'vue'
	import debounce from 'lodash.debounce'

	interface Artist {
		objectID: string
		name: string
		active_career: boolean
		birth_date: string | null
		created_at: string
		debut_date: string | null
		description: string
		gender: string
		image: string
		type: string
		updated_at: string
		verified: boolean
		_highlightResult?: Record<string, any>
		_snippetResult?: Record<string, any>
		_rankingInfo?: Record<string, any>
		_distinctSeqID?: number
	}

	// Initialisation des réactifs
	const searchInput = ref('')
	const datas = ref<Artist[]>([])

	// Utilisation de Algolia Search de manière optimisée
	const { result, search } = useAlgoliaSearch('ARTISTS')

	// Définition d'une fonction de recherche débattue
	const debouncedSearch = debounce(async (query: any) => {
		await useAsyncData('ssr-search-results', () => search({ query }))
		if (!result.value) return
		console.log(result.value.hits)
		datas.value = result.value.hits.slice(0, 10) as Artist[]
	}, 500) // Attend 500ms après le dernier appel avant d'exécuter la fonction

	watchEffect(() => {
		if (searchInput.value.length > 2) {
			debouncedSearch(searchInput.value)
		}
	})

	const emit = defineEmits(['closeModal'])
	const closeModal = () => {
		emit('closeModal')
	}
</script>

<template>
	<UModal
		:ui="{
			overlay: 'bg-cb-quinary-950/75',
			content: 'ring-cb-quinary-950',
		}"
	>
		<UButton
			icon="material-symbols:search"
			variant="soft"
			class="bg-cb-quaternary-950 hover:bg-cb-tertiary-200/20 h-full items-center justify-center text-xs text-white"
		/>

		<template #content>
			<div class="relative space-y-2">
				<input
					id="search-input"
					v-model="searchInput"
					type="text"
					placeholder="Search Artist..."
					class="bg-cb-quinary-900 placeholder-cb-tertiary-200 focus:bg-cb-tertiary-200 focus:text-cb-quinary-900 focus:placeholder-cb-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
				/>
				<div v-if="datas.length" class="flex flex-col gap-2" @click="closeModal">
					<LazyNuxtLink
						v-for="artist in datas"
						:key="artist.objectID"
						:to="`/artist/${artist.objectID}`"
					>
						<p class="bg-cb-primary-900 w-full rounded p-2 text-xs">{{ artist.name }}</p>
					</LazyNuxtLink>
				</div>
			</div>
		</template>
	</UModal>
</template>
