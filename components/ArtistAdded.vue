<script setup>
const { artists } = defineProps({
  artists: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <CardDefault name="Artist added" :class="{ 'hidden': !artists }">
    <div class="py-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5">
      <LazyCardArtist v-for="artist in artists" :key="artist.id" :id="artist.id" :name="artist.name"
        :image="artist.image" />
    </div>
  </CardDefault>
</template>