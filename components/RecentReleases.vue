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
      class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight"
    >
      <CardObject 
        v-for="release in releases"
        :key="release.idYoutubeMusic"
        :artistId="release.artistsId"
        :mainTitle="release.name"
        :subTitle="release.artistsName"
        :image="release.image"
        :releaseDate="release.date"
        :releaseType="release.type"
        :objectLink="`/release/${release.idYoutubeMusic}`"
      />
    </div>
    <div v-else class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight">
      <SkeletonRelease v-for="i in 8" :key="`skeleton_release_` + i" class="snap-start min-w-[10rem] max-w-[10rem]" />
    </div>
  </CardDefault>
</template>
