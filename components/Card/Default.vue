<script setup>
// props name not required
const { name } = defineProps({
  name: {
    type: String,
    required: false,
  },
  additionalClass: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm font-semibold uppercase" :class="additionalClass">
      {{ name }}
    </p>
    <slot />
  </div>
</template>
