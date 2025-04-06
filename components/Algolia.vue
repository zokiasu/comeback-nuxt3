<script setup lang="ts">
	import { ref, watchEffect } from 'vue'
	import debounce from 'lodash.debounce'

	// Initialisation des réactifs
	const searchInput = ref('')
	const datas = ref([])

	// Utilisation de Algolia Search de manière optimisée
	const { result, search } = useAlgoliaSearch('ARTISTS')

	// Définition d'une fonction de recherche débattue
	const debouncedSearch = debounce(async (query: any) => {
		await useAsyncData('ssr-search-results', () => search({ query }))
		if (!result.value) return
		datas.value = result.value.hits.slice(0, 10)
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
