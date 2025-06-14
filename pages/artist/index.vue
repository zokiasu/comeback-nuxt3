<template>
	<div class="container mx-auto py-10">
		<div class="mb-4">
			<UInput
				v-model="search"
				type="text"
				placeholder="Search for an artist..."
				class="w-full"
			/>
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
		<div v-if="isLoading" class="text-center py-4">
			Chargement...
		</div>
		<div v-if="!hasMore && artists.length > 0" class="text-center py-4 text-gray-400">
			Tous les artistes sont affichés.
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useSupabaseArtist } from '@/composables/Supabase/useSupabaseArtist';
import { useInfiniteScroll } from '@vueuse/core';
import type { Artist } from '~/types';

const { getArtistsByPage } = useSupabaseArtist();

const artists = ref<Artist[]>([]);
const search = ref('');
const page = ref(1);
const limit = ref(48);
const isLoading = ref(false);
const hasMore = ref(true);

const fetchArtists = async (reset = false) => {
	if (isLoading.value || (!hasMore.value && !reset)) return;
	isLoading.value = true;
	const result = await getArtistsByPage(page.value, limit.value, { search: search.value });
	if (reset) {
		artists.value = result.artists;
	} else {
		artists.value = [...artists.value, ...result.artists];
	}
	hasMore.value = result.artists.length === limit.value;
	isLoading.value = false;
};

watch(search, () => {
	page.value = 1;
	hasMore.value = true;
	fetchArtists(true);
});

const loadMore = async () => {
	if (isLoading.value || !hasMore.value) return;
	page.value++;
	await fetchArtists();
};

onMounted(() => {
	fetchArtists(true);
});

useInfiniteScroll(
	window,
	loadMore,
	{
		distance: 200,
		canLoadMore: () => hasMore.value && !isLoading.value,
	}
);
</script>