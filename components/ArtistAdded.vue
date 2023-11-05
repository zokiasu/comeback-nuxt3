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
      class="grid grid-cols-2 gap-5 py-5 md:grid-cols-4 xl:grid-cols-8"
    >
      <CardArtist
        v-for="artist in artists"
        :key="artist.id"
        :name="artist.name"
        :image="artist.image"
        :id="artist.id"
      />
    </div>
    <div v-else class="grid grid-cols-2 gap-5 py-5 md:grid-cols-4 xl:grid-cols-8">
      <SkeletonArtist v-for="i in 8" :key="`skeleton_artist_` + i" />
    </div>
  </CardDefault>
</template>
