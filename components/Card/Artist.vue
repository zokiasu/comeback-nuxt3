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
    default: 'min-h-[5rem] min-w-[5rem] md:min-h-[8rem] md:min-w-[8rem] max-h-[5rem] max-w-[5rem] md:max-h-[8rem] md:max-w-[8rem]',
  },
})

const skeleton = ref(null)

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}
</script>

<template>
  <div class="space-y-2">
    <NuxtLink :to="`/artist/${id}`">
      <div class="relative">
        <div
          ref="skeleton"
          :class="dimension"
          class="absolute inset-0 z-10 mx-auto aspect-square animate-pulse rounded-full bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"
        ></div>
        <nuxt-img
          :src="image"
          :alt="name"
          quality="50"
          loading="lazy"
          @load="loadingDone"
          class="mx-auto aspect-square rounded-full bg-zinc-500 object-cover"
          :class="dimension"
        />
      </div>
    </NuxtLink>
    <div v-if="name" class="flex justify-center text-xs">
      <NuxtLink :to="`/artist/${id}`" class="mt-1">
        <p v-if="name" class="hover-underline-animation mx-auto truncate text-center text-xs font-bold">
          {{ name }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
