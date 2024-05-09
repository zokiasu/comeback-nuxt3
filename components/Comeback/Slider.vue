<template>
  <div class="relative overflow-hidden">
    <div
      class="absolute inset-0 z-10 max-h-[20rem] min-h-[20rem] w-full bg-quinary object-cover transition-all duration-500 ease-in-out md:max-h-[30rem] md:min-h-[30rem] lg:aspect-video lg:max-h-[40rem] lg:min-h-[40rem]"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    ></div>
    <NuxtImg
      format="webp"
      :alt="name"
      :src="image"
      @load="imageLoaded = true"
      class="max-h-[20rem] min-h-[20rem] w-full object-cover md:max-h-[30rem] md:min-h-[30rem] lg:aspect-video lg:max-h-[40rem] lg:min-h-[40rem]"
    />
  </div>
  <NuxtLink
    :to="`/artist/${id}`"
    class="absolute inset-0 z-50 flex flex-col items-start sm:items-center justify-end sm:justify-center bg-secondary/30 p-5"
  >
    <p class="text-3xl font-bold lg:text-5xl xl:text-7xl 2xl:text-9xl">
      {{ name }}
    </p>
  </NuxtLink>
</template>

<script lang="ts" setup>
const { image, name, id } = defineProps({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})
const imageLoaded = ref(false)
</script>
