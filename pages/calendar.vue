<script setup>
import { Timestamp } from 'firebase/firestore';
const releases = ref(null)
onMounted(async () => {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  const todayTimestamp = Timestamp.fromDate(today)
  releases.value = await fetchReleases(todayTimestamp, 7)
})
</script>

<template>
  <div class="p-10 flex gap-10">
    <LazyCardRelease v-for="release in releases" :key="release.id" :id="release.id" :image="release.image"
      :date="release.date" :name="release.name" :type="release.type" :artistsId="release.artistsId"
      :artistsName="release.artistsName" :displayDate="true" />
  </div>
</template>