<script setup>
const { newsT } = defineProps({
  newsT: {
    type: Array,
    required: true
  }
})
const maxDisplay = ref(9)
</script>

<template>
  <CardDefault name="Comeback reported" :class="{ 'hidden': !newsT }">
    <div class="py-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <CardNews
        v-for="newsT in newsT.slice(0, maxDisplay)"
        :key="newsT.id"
        :message="newsT.message"
        :date="newsT.date"
        :artist="newsT.artist"
      />
    </div>
    <button v-if="newsT.length > 9 && newsT.length != maxDisplay" class="font-semibold text-center w-full" @click="maxDisplay = newsT.length">
      <p>See More</p>
      <IconArrowDown class="w-5 h-5 mx-auto" />
    </button>
    <button v-if="newsT.length == maxDisplay" class="font-semibold text-center w-full" @click="maxDisplay = 9">
      <IconArrowUp class="w-5 h-5 mx-auto" />
      <p>See Less</p>
    </button>
  </CardDefault>
</template>