<script setup>
const { comebackList } = defineProps({
  comebackList: {
    type: Array,
    required: true,
  },
})
const maxDisplay = ref(12)
const minDisplay = ref(3)

const setMaxDisplay = () => {
  const width = window.innerWidth

  if (width < 1280) {
    // Pour les écrans moyens
    maxDisplay.value = 6
    minDisplay.value = 6
  } else {
    // Pour les grands écrans
    maxDisplay.value = 12
    minDisplay.value = 12
  }
}

onMounted(() => {
  setMaxDisplay()
  window.addEventListener('resize', setMaxDisplay)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setMaxDisplay)
})
</script>

<template>
  <CardDefault name="Comeback reported" :class="{ hidden: !comebackList }">
    <div
      v-if="comebackList.length"
      class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3"
    >
      <CardNews
        v-for="comeback in comebackList.slice(0, maxDisplay)"
        :key="comeback.id"
        :message="comeback.message"
        :date="comeback.date"
        :artist="comeback.artist"
      />
    </div>
    <div v-else class="grid grid-cols-1 gap-2 py-5 md:grid-cols-2 2xl:grid-cols-3">
      <SkeletonDefault
        v-for="i in maxDisplay"
        :key="`comeback_skeleton_` + i"
        class="h-12 rounded"
      />
    </div>
    <div class="mt-5 text-center">
      <button
        v-if="comebackList.length != maxDisplay && comebackList.length >= maxDisplay"
        class="w-fit font-semibold"
        @click="maxDisplay = comebackList.length"
      >
        <p>See More</p>
        <IconArrowDown class="mx-auto h-5 w-5" />
      </button>
      <button
        v-if="comebackList.length == maxDisplay && comebackList.length >= maxDisplay"
        class="w-fit font-semibold"
        @click="maxDisplay = minDisplay"
      >
        <IconArrowUp class="mx-auto h-5 w-5" />
        <p>See Less</p>
      </button>
    </div>
  </CardDefault>
</template>
