<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import debounce from 'lodash.debounce';

// Initialisation des réactifs
const searchInput = ref('');
const datas = ref([]);

// Utilisation de Algolia Search de manière optimisée
const { result, search } = useAlgoliaSearch('Artists');

// Définition d'une fonction de recherche débattue
const debouncedSearch = debounce(async (query: any) => {
  await useAsyncData('ssr-search-results', () => search({ query }));
  if(!result.value) return;
  datas.value = result.value.hits.slice(0, 10);
}, 500); // Attend 500ms après le dernier appel avant d'exécuter la fonction

watchEffect(() => {
  if (searchInput.value.length > 2) {
    debouncedSearch(searchInput.value);
  }
});

const emit = defineEmits(['closeModal']);
const closeModal = () => {
  emit('closeModal')
};
</script>

<template>
  <div class="relative space-y-2">
    <input
      id="search-input"
      v-model="searchInput"
      type="text"
      placeholder="Search Artist..."
      class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
    />
    <div v-if="datas.length" @click="closeModal" class="flex flex-col gap-2">
      <LazyNuxtLink :to="`/artist/${artist.id}`" v-for="artist in datas" :key="artist.id">
        <p class="bg-primary p-2 rounded w-full text-xs">{{ artist.name }}</p>
      </LazyNuxtLink>
    </div>
  </div>
</template>
