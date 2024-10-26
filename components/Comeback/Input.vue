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

const emit = defineEmits(['clear'])

const clear = () => {
  emit('clear')
}
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <ComebackLabel v-if="label" :disabled="disabled" :label="label" />
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="appearance-none rounded border bg-quaternary border-transparent py-1.5 px-2 transition-all duration-150 ease-in-out focus:rounded focus:border-primary outline-none"
      :class="{ 'border-zinc-500 text-zinc-500': disabled }"
    />
    <button v-if="modelValue && !disabled" @click="clear" class="absolute right-2 bottom-3">
      <IconClose class="w-4 h-4" />
    </button>
  </div>
</template>
