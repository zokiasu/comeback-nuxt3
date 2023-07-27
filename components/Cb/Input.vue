<script setup>
const { name, placeholder, value } = defineProps({
  label: {
    type: String,
    required: false
  },
  placeholder: {
    type: String,
    required: false
  },
  value: {
    type: String,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false
  },
  type: {
    type: String,
    default: 'text',
    required: false
  }
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <CbLabel v-if="label" :disabled="disabled" :label="label" />
    <input :type="type" :placeholder="placeholder" :value="value" :disabled="disabled"
      class="bg-transparent border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
      :class="{ 'text-zinc-500 border-zinc-500': disabled }">
  </div>
</template>