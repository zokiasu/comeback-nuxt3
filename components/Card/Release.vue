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
</script>

<template>
  <div class="min-w-[3rem] max-w-[8rem] space-y-2">
    <NuxtLink :to="`/release/${id}`">
      <div class="group relative">
        <div class="rounded bg-quinary">
          <nuxt-img :src="image" :alt="name" quality="80" loading="lazy"
            class="aspect-square max-h-[8rem] min-h-[3rem] w-full rounded object-cover drop-shadow-2xl" />
        </div>
        <div v-if="displayDate"
          class="invisible absolute top-2 right-1.5 rounded bg-quinary bg-opacity-80 px-2 py-0.5 group-hover:visible">
          <p class="text-center text-xs">
            {{
              new Date(date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })
            }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <div class="space-y-0.5">
      <p class="truncate font-bold text-xs">{{ name }}</p>
      <div v-if="artistsId && artistsName" class="text-xs">
        <NuxtLink :to="`/artist/${artistsId}`" class="mt-1">
          <p v-if="artistsName" class="hover-underline-animation truncate">
            {{ artistsName }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>