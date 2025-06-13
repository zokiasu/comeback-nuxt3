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
				:sub-title="artist.name"
				:image="artist.image"
				:release-date="artist.date"
				:release-type="artist.type"
				:object-link="`/artist/${artist.id}`"
				date-always-display
				class="!min-w-full"
			/>
		</transition-group>
		<UPagination
			v-if="totalPages > 1"
			v-model="page"
			:page-count="1"
			:total="totalPages"
			:max="7"
			class="mt-8 flex justify-center"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useSupabaseArtist } from '@/composables/Supabase/useSupabaseArtist';

const { getArtistsByPage } = useSupabaseArtist();

const artists = ref<Artist[]>([]);
const search = ref('');
const page = ref(1);
const limit = ref(48);
const totalPages = ref(1);

const fetchArtists = async () => {
	const result = await getArtistsByPage(page.value, limit.value, { search: search.value });
	artists.value = result.artists;
	totalPages.value = result.totalPages;
};

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(search, () => {
	if (debounceTimeout) clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		page.value = 1;
		fetchArtists();
	}, 400);
});

watch(page, fetchArtists);

onMounted(fetchArtists);
</script>