<script setup>
import { Timestamp } from 'firebase/firestore';

const artists = ref(null)
onMounted(async () => {
  const today = new Date()
  today.setDate(today.getDate())
  const todayTimestamp = Timestamp.fromDate(today)
  artists.value = await fetchArtists(todayTimestamp, 8)
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