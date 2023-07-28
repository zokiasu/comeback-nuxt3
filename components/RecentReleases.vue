<script setup>
import { Timestamp } from 'firebase/firestore';
const releases = ref(null)
onBeforeMount(async () => {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  const todayTimestamp = Timestamp.fromDate(today)
  releases.value = await fetchReleasesWithDateAndLimit(todayTimestamp, 8)
})
</script>
<template>
  <CardDefault name="Recent Releases" :class="{ 'hidden': !releases }">
    <div class="py-5 grid grid-cols-2 gap-5 w-full md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
      <LazyCardRelease 
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
        class="mx-auto"
      />
    </div>
  </CardDefault>
</template>