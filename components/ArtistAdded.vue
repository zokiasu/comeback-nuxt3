<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';

const artistDate = new Date()
const artists = ref([] as any[])

onMounted(async () => {
  artists.value = await fetchArtistsWithLimit(Timestamp.fromDate(artistDate), 6)
})
</script>

<template>
  <CardDefault v-if="artists.length > 1" name="Artist added" :class="{ 'hidden': !artists }">
    <div class="flex flex-wrap gap-5 justify-between py-5">
      <CardArtist 
        v-for="artist in artists"
        :key="artist.id"
        :name="artist.name"
        :image="artist.image"
        :id="artist.id"
      />
    </div>
  </CardDefault>
</template>