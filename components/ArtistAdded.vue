<script setup>
	const { artists } = defineProps({
		artists: {
			type: Array,
			required: true,
		},
	})
</script>

<template>
	<CardDefault name="Artist added">
		<div
			v-if="artists.length"
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
		<div
			v-else
			class="scrollBarLight relative flex w-full snap-x snap-mandatory justify-between gap-5 overflow-x-auto pb-5"
		>
			<SkeletonArtist
				v-for="i in 8"
				:key="`skeleton_artist_` + i"
				class="min-w-[10rem] max-w-[10rem] snap-start"
			/>
		</div>
	</CardDefault>
</template>
