<script setup>
const { artists } = defineProps({
  artists: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <CardDefault name="Artist added" :class="{ hidden: !artists }">
    <div class="grid grid-cols-2 gap-5 py-5 md:grid-cols-4 xl:grid-cols-8">
      <CardArtist v-for="artist in artists" :key="artist.id" :name="artist.name" :image="artist.image" :id="artist.id" />
    </div>
  </CardDefault>
</template>
