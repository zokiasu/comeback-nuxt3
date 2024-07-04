<script setup>
const { comebackList } = defineProps({
  comebackList: {
    type: Array,
    required: true,
  },
})
const maxDisplay = ref(12)
const minDisplay = ref(3)
const seeMore = ref(false)

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
      class="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3 mb-5"
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
    <div v-if="comebackList.length > maxDisplay" class="flex w-full justify-center">
      <button
        v-if="seeMore"
        type="button"
        class="flex gap-1 items-center w-fit font-semibold border border-tertiary rounded p-1"
        @click="maxDisplay = comebackList.length"
      >
        <!-- <p>See More</p> -->
        <IconPlus class="mx-auto h-3 w-3" />
      </button>
      <button
        v-else
        type="button"
        class="flex gap-1 items-center w-fit font-semibold border border-tertiary rounded p-1"
        @click="maxDisplay = minDisplay"
      >
        <!-- <p>See Less</p> -->
        <IconMinus class="mx-auto h-3 w-3" />
      </button>
    </div>
  </CardDefault>
</template>
