<script setup lang="ts">
	import type { Release } from '~/types/supabase/release'

	const { releases } = defineProps<{
		releases: Release[]
	}>()
</script>
<template>
	<CardDefault name="Recent Releases">
		<div
			class="relative flex justify-between w-full gap-5 pb-5 overflow-x-auto scrollBarLight snap-x snap-mandatory"
		>
			<CardObject
				v-for="release in releases"
				:key="release.id_youtube_music"
				:artist-id="release.artists ? release.artists[0].id : 'index'"
				:main-title="release.name"
				:sub-title="
					release.artists
						? release.artists.map((artist) => artist.name).join(', ')
						: 'Unknown'
				"
				:image="release.image"
				:release-date="release.date"
				:release-type="release.type"
				:object-link="`/release/${release.id}`"
			/>
		</div>
	</CardDefault>
</template>
