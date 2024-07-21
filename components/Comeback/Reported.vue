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
    return displayAll.value ? comebackList : comebackList.slice(0, maxDisplay.value);
  })

  const toggleDisplayAll = () => {
    displayAll.value = !displayAll.value;
  };
</script>

<template>
  <CardDefault name="Comeback reported" :class="{ hidden: !comebackList.length }">
    <div
      v-if="comebackList.length"
      class="grid grid-cols-1 gap-2 mb-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      <CardNews
        v-for="comeback in comebackToDisplay"
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
        type="button"
        class="flex items-center gap-1 p-1 font-semibold border rounded w-fit border-tertiary"
        @click="toggleDisplayAll"
      >
        <IconPlus v-if="!displayAll" class="w-3 h-3 mx-auto" />
        <IconMinus v-else class="w-3 h-3 mx-auto" />
      </button>
    </div>
  </CardDefault>
</template>
