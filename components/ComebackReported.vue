<script setup>
import { Timestamp } from 'firebase/firestore';

const newsT = ref(null)
onMounted(async () => {
  const today = new Date()
  today.setDate(today.getDate() - 3)
  const todayTimestamp = Timestamp.fromDate(today)
  newsT.value = await fetchNews(todayTimestamp)
})
</script>
<template>
  <card name="Comeback reported">
    <div class="space-y-3 p-5 grid grid-cols-1">
      <NewsCard v-for="newsT in newsT" :key="newsT.id" :message="newsT.message" :date="newsT.date"
        :artist="newsT.artist" />
    </div>
  </card>
</template>