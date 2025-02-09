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
    type: [String, Number],
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

const emit = defineEmits(['update:modelValue', 'clear'])

const updateValue = (event) => {
  const value = event.target.value
  if (typeof modelValue === 'number') {
    emit('update:modelValue', value ? parseInt(value) : null)
  } else {
    emit('update:modelValue', value)
  }
}

const clear = () => {
  emit('clear')
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative flex flex-col gap-1">
    <ComebackLabel v-if="label" :disabled="disabled" :label="label" />
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue?.toString()"
      @input="updateValue($event)"
      :disabled="disabled"
      class="appearance-none rounded border bg-quaternary border-transparent py-1.5 px-2 transition-all duration-150 ease-in-out focus:rounded focus:border-primary outline-none"
      :class="{ 'border-zinc-500 text-zinc-500': disabled }"
    />
    <button v-if="modelValue && !disabled" @click="clear" class="absolute right-2 bottom-3">
      <IconClose class="w-4 h-4" />
    </button>
  </div>
</template>
