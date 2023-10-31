<script setup>
const { id, image, date, name, type, artistsId, artistsName, displayDate } = defineProps({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  artistsId: {
    type: String,
    required: true,
  },
  artistsName: {
    type: String,
    required: true,
  },
  displayDate: {
    type: Boolean,
    default: false,
  },
  yearReleased: {
    type: Number,
    required: false,
  },
  size: {
    type: String,
    required: false,
    default: 'min-w-[10rem] max-w-[10rem]',
  },
})

const skeleton = ref(null)

const dateTimestamp = ref(null)
onBeforeMount(() => {
  dateTimestamp.value = new Date(date.seconds * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
})

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}
</script>

<template>
  <div class="mx-auto space-y-2 md:mx-0" :class="size">
    <NuxtLink :to="`/release/${id}`">
      <div class="group relative">
        <div
          ref="skeleton"
          class="absolute inset-0 z-10 animate-pulse rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"
        ></div>
        <nuxt-img
          :src="image"
          :alt="name"
          quality="50"
          loading="lazy"
          @load="loadingDone"
          class="aspect-square w-full rounded bg-zinc-500 object-cover drop-shadow-2xl"
          :class="size"
        />

        <div
          v-if="displayDate"
          class="invisible absolute right-1.5 top-2 rounded bg-quinary bg-opacity-80 px-2 py-0.5 group-hover:visible"
        >
          <p class="text-center text-xs">
            {{ dateTimestamp }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <div class="space-y-0.5">
      <p class="truncate text-xs font-bold">{{ name }}</p>
      <div v-if="artistsId && artistsName" class="text-xs">
        <NuxtLink :to="`/artist/${artistsId}`" class="mt-1">
          <p
            v-if="artistsName"
            class="hover-underline-animation hover-underline-animation truncate"
          >
            {{ artistsName }}
            <span v-if="yearReleased">- {{ yearReleased }}</span>
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
