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
    <div
      v-if="releases.length > 0"
      class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight"
    >
      <!-- <CardRelease
        v-for="release in releases"
        :key="release.id"
        :id="release.id"
        :image="release.image"
        :date="release.date"
        :name="release.name"
        :type="release.type"
        :artistsId="release.artistsId"
        :artistsName="release.artistsName"
        :displayDate="true"
        size="min-w-[8rem] max-w-[10rem] snap-start"
      /> -->
      <CardObject 
        v-for="release in releases"
        :key="release.id"
      />
    </div>
    <div v-else class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight">
      <SkeletonRelease v-for="i in 8" :key="`skeleton_release_` + i" class="snap-start min-w-[10rem] max-w-[10rem]" />
    </div>
  </CardDefault>
</template>
