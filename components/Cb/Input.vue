<script setup>
const { name, placeholder, modelValue } = defineProps({
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  modelValue: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String,
    default: 'text',
    required: false,
  },
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <CbLabel v-if="label" :disabled="disabled" :label="label" />
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
      :class="{ 'border-zinc-500 text-zinc-500': disabled }"
    />
  </div>
</template>
