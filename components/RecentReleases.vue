<script setup lang="ts">
import { Timestamp } from 'firebase/firestore';

const releases = ref([] as any[])
const releaseDate = new Date()
releaseDate.setDate(releaseDate.getDate() - 8)

onMounted(async () => {
  releases.value = await fetchReleasesWithDateAndLimit(Timestamp.fromDate(releaseDate), 8)
})
</script>
<template>
  <CardDefault v-if="releases.length > 1" name="Recent Releases" :class="{ 'hidden': !releases }">
    <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-5 py-5">
      <CardRelease v-for="release in releases" :key="release.id" :id="release.id" :image="release.image"
        :date="release.date" :name="release.name" :type="release.type" :artistsId="release.artistsId"
        :artistsName="release.artistsName" :displayDate="true" size="min-w-[8rem] max-w-[10rem]" />
    </div>
  </CardDefault>
</template>