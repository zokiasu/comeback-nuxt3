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
      class="relative w-full flex gap-5 snap-x snap-mandatory overflow-x-auto py-5 scrollBarLight"
    >
      <CardArtist
        v-for="artist in artists"
        :key="artist.id"
        :name="artist.name"
        :image="artist.image"
        :id="artist.id"
      />
    </div>
    <div v-else class="relative w-full flex gap-5 snap-x snap-mandatory overflow-x-auto py-5 scrollBarLight">
      <SkeletonArtist v-for="i in 8" :key="`skeleton_artist_` + i" />
    </div>
  </CardDefault>
</template>
