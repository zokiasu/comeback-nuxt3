<script setup>
// props name not required
const { name } = defineProps({
  name: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="rounded-lg spacey-10 shadow-md shadow-zinc-700 border-zinc-700 border p-3">
    <p class="text-sm font-semibold uppercase border-b border-zinc-800 pb-1">{{ name }}</p>
    <slot />
  </div>
</template>