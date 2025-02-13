<script setup>
	const { releases } = defineProps({
		releases: {
			type: Array,
			required: true,
		},
	})
</script>
<template>
	<CardDefault name="Recent Releases">
		<!-- <p class="text-primary text-sm italic">Some troubles have been noticed with our release recovery API and are working to resolve them quickly. We apologize for the inconvenience.</p> -->
		<div
			v-if="releases.length > 0"
			class="scrollBarLight relative flex w-full snap-x snap-mandatory justify-between gap-5 overflow-x-auto pb-5"
		>
			<CardObject
				v-for="release in releases"
				:key="release.idYoutubeMusic"
				:artist-id="release.artistsId"
				:main-title="release.name"
				:sub-title="release.artistsName"
				:image="release.image"
				:release-date="release.date"
				:release-type="release.type"
				:object-link="`/release/${release.idYoutubeMusic}`"
			/>
		</div>
		<div
			v-else
			class="scrollBarLight relative flex w-full snap-x snap-mandatory justify-between gap-5 overflow-x-auto pb-5"
		>
			<SkeletonRelease
				v-for="i in 8"
				:key="`skeleton_release_` + i"
				class="min-w-[10rem] max-w-[10rem] snap-start"
			/>
		</div>
	</CardDefault>
</template>
