<script setup>
  const { comebackList } = defineProps({
    comebackList: {
      type: Array,
      required: true,
    },
  })

  const displayAll = ref(false)
  const maxDisplay = ref(12)

  const comebackToDisplay = computed(() => {
    return comebackList.slice(0, maxDisplay.value)
  })
</script>

<template>
  <CardDefault name="Comeback reported" :class="{ hidden: !comebackList }">
    <div
      v-if="comebackList.length"
      class="grid grid-cols-1 gap-2 mb-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      <CardNews
        v-for="comeback in comebackList"
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
    <div v-if="comebackList.length > maxDisplay" class="flex justify-center w-full">
      <button
        v-if="!displayAll"
        type="button"
        class="flex items-center gap-1 p-1 font-semibold border rounded w-fit border-tertiary"
        @click="displayAll = true"
      >
        <IconPlus class="w-3 h-3 mx-auto" />
      </button>
      <button
        v-else
        type="button"
        class="flex items-center gap-1 p-1 font-semibold border rounded w-fit border-tertiary"
        @click="displayAll = false"
      >
        <IconMinus class="w-3 h-3 mx-auto" />
      </button>
    </div>
  </CardDefault>
</template>
