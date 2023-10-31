<script setup>
const { newsT } = defineProps({
  newsT: {
    type: Array,
    required: true,
  },
})
const maxDisplay = ref(9)
</script>

<template>
  <CardDefault name="Comeback reported" :class="{ hidden: !newsT }">
    <div class="grid grid-cols-1 gap-2 py-5 md:grid-cols-2 xl:grid-cols-3">
      <CardNews v-for="newsT in newsT.slice(0, maxDisplay)" :key="newsT.id" :message="newsT.message" :date="newsT.date" :artist="newsT.artist" />
    </div>
    <button v-if="newsT.length > 9 && newsT.length != maxDisplay" class="w-full text-center font-semibold" @click="maxDisplay = newsT.length">
      <p>See More</p>
      <IconArrowDown class="mx-auto h-5 w-5" />
    </button>
    <button v-if="newsT.length == maxDisplay" class="w-full text-center font-semibold" @click="maxDisplay = 9">
      <IconArrowUp class="mx-auto h-5 w-5" />
      <p>See Less</p>
    </button>
  </CardDefault>
</template>
