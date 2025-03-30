<script setup lang="ts">
	import type { Artist } from '~/types/supabase/artist'

	const { artists } = defineProps<{
		artists: Artist[]
	}>()
</script>

<template>
	<CardDefault name="Artist added">
		<div
			class="scrollBarLight relative flex w-full snap-x snap-mandatory justify-between gap-5 overflow-x-auto pb-5"
		>
			<CardObject
				v-for="artist in artists"
				:key="artist.id"
				is-artist
				:artist-id="artist.id"
				:main-title="artist.name"
				:sub-title="artist.type"
				:image="artist.image"
				:object-link="`/artist/${artist.id}`"
				class="snap-start"
			/>
		</div>
	</CardDefault>
</template>
