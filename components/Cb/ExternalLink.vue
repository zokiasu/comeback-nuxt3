<script setup>
const icon = ref(null)
const text = ref(null)

// props href
const { href } = defineProps({
  href: {
    type: String,
    required: true
  }
})
</script>

<template>
  <a :href="checkUrl()" target="_blank"
    class="flex items-center space-x-2 px-3 py-2 transition-all duration-300 ease-in-out hover:bg-secondary hover:drop-shadow-2xl">
    <component :is="icon" class="h-5 w-5"></component>
    <p class="hidden md:block">{{ text }}</p>
  </a>
</template>