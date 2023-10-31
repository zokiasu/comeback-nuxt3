<script setup>
// props name not required
const { name } = defineProps({
  name: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div>
    <p class="border-b border-zinc-800 pb-1 text-sm font-semibold uppercase">{{ name }}</p>
    <slot />
  </div>
</template>
