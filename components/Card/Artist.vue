<script setup>
const { id, image, name, dimension } = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  dimension: {
    type: String,
    default:
      'min-h-[5rem] min-w-[5rem] md:min-h-[8rem] md:min-w-[8rem] max-h-[5rem] max-w-[5rem] md:max-h-[8rem] md:max-w-[8rem]',
  },
})
</script>

<template>
  <div class="space-y-2">
    <NuxtLink :to="`/artist/${id}`">
      <div>
        <nuxt-img :src="image" :alt="name" loading="lazy" class="mx-auto aspect-square rounded-full object-cover"
          :class="dimension" />
      </div>
    </NuxtLink>
    <div v-if="name" class="text-xs flex justify-center">
      <NuxtLink :to="`/artist/${id}`" class="mt-1">
        <p v-if="name" class="truncate font-bold text-xs text-center hover-underline-animation mx-auto">
          {{ name }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>