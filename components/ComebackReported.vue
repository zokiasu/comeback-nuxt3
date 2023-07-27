<script setup>
import { Timestamp } from 'firebase/firestore';

const newsT = ref(null)
onMounted(async () => {
  const today = new Date()
  today.setDate(today.getDate() - 7)
  const todayTimestamp = Timestamp.fromDate(today)
  newsT.value = await fetchNews(todayTimestamp, 9)
})
</script>
<template>
  <CardDefault name="Comeback reported" :class="{ 'hidden': !newsT }">
    <div class="py-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <LazyCardNews v-for="newsT in newsT" :key="newsT.id" :message="newsT.message" :date="newsT.date"
        :artist="newsT.artist" />
    </div>
  </CardDefault>
</template>