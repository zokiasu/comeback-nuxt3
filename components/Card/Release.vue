<script setup>
const { id, image, date, name, type, artistsId, artistsName, displayDate } = defineProps({
  id: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
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
  <div class="min-w-[8rem] max-w-[8rem] space-y-2">
    <NuxtLink :to="`/release/${id}`">
      <div class="group relative">
        <div
          ref="skeleton"
          class="absolute z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
        ></div>
        <nuxt-img :src="image" :alt="name" quality="80" loading="lazy" @load="loadingDone"
          class="aspect-square bg-zinc-500 max-h-[8rem] min-h-[8rem] w-full rounded object-cover drop-shadow-2xl" />

        <div v-if="displayDate"
          class="invisible absolute top-2 right-1.5 rounded bg-quinary bg-opacity-80 px-2 py-0.5 group-hover:visible">
          <p class="text-center text-xs">
            {{ dateTimestamp }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <div class="space-y-0.5">
      <p class="truncate font-bold text-xs">{{ name }}</p>
      <div v-if="artistsId && artistsName" class="text-xs">
        <NuxtLink :to="`/artist/${artistsId}`" class="mt-1">
          <p v-if="artistsName" class="hover-underline-animation truncate hover-underline-animation">
            {{ artistsName }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>