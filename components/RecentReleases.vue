<script setup>
import { Timestamp } from 'firebase/firestore';
const releases = ref(null)
onMounted(async () => {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  const todayTimestamp = Timestamp.fromDate(today)
  releases.value = await fetchReleases(todayTimestamp, 8)
})
</script>
<template>
  <CardDefault name="Recent Releases" :class="{ 'hidden': !releases }">
    <div class="py-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      <LazyCardRelease v-for="release in releases" :key="release.id" :id="release.id" :image="release.image"
        :date="release.date" :name="release.name" :type="release.type" :artistsId="release.artistsId"
        :artistsName="release.artistsName" :displayDate="true" />
    </div>
  </CardDefault>
</template>