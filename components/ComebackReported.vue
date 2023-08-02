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
  <CardDefault v-if="newsT" name="Comeback reported" :class="{ 'hidden': !newsT }">
    <transition-group name="list-complete" tag="div" class="py-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <LazyCardNews v-for="newsT in newsT.slice(0, maxDisplay)" :key="newsT.id" :message="newsT.message" :date="newsT.date"
        :artist="newsT.artist" />
    </transition-group>
    <button v-if="newsT.length > 9 && newsT.length != maxDisplay" class="font-semibold text-center w-full" @click="maxDisplay = newsT.length">
      See More
    </button>
    <button v-if="newsT.length == maxDisplay" class="font-semibold text-center w-full" @click="maxDisplay = 9">
      See Less
    </button>
  </CardDefault>
</template>