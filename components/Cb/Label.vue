<script setup>
const { name, placeholder } = defineProps({
  label: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false
  }
})
</script>
<template>
  <div>
    <label class="text-sm uppercase font-semibold tracking-wide" :class="{ 'text-zinc-500': disabled }">{{ label
    }}</label>
  </div>
</template>