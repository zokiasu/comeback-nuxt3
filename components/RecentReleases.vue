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
      class="grid grid-cols-2 gap-5 py-5 md:grid-cols-4 xl:grid-cols-8"
    >
      <CardRelease
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
        size="min-w-[8rem] max-w-[10rem]"
      />
    </div>
    <div v-else class="grid grid-cols-2 gap-5 py-5 md:grid-cols-4 xl:grid-cols-8">
      <SkeletonRelease v-for="i in 8" :key="`skeleton_release_` + i" />
    </div>
  </CardDefault>
</template>
