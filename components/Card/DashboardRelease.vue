<script setup>
const { id, artistsName, createdAt, date, idYoutubeMusic, image, name, needToBeVerified, platforms, type, yearReleased } = defineProps({
  id: {
    type: String,
    required: true,
  },
  artistsName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  idYoutubeMusic: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  needToBeVerified: {
    type: Boolean,
    required: true,
  },
  platforms: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  yearReleased: {
    type: String,
    required: true,
  },
})

const releaseDate = new Date(date.seconds * 1000).toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const emit = defineEmits(['deleteRelease'])
const deleteRelease = () => {
  emit('deleteRelease', id)
}
</script>

<template>
  <div class="list-complete-item h-full bg-quaternary p-3 rounded space-y-1.5 relative">
    <div class="flex text-sm w-full justify-between">
      <div class="flex gap-1">
        <p>[ {{ type }} ]</p>
        <p>[ {{ yearReleased }} ]</p>
      </div>
      <p>
        {{ idYoutubeMusic }}
      </p>
    </div>
    <p v-if="needToBeVerified" class="absolute bg-red-500 text-xs rounded-full px-2 font-semibold">Need To Be Verified</p>
    <nuxt-img :src="image" :alt="name" quality="30" loading="lazy" class="rounded bg-zinc-500" />

    <div>
      <NuxtLink :to="'/release/' + id" target="_blank" class="font-semibold hover:text-primary transition-all ease-in-out duration-300">
        {{ name }}
      </NuxtLink>
      <p class="border-t border-zinc-500">{{ artistsName }}</p>
    </div>

    <div class="pt-2 space-y-2">
      <p class="text-xs font-semibold uppercase border-b border-zinc-500 pb-1">Platforms</p>
      <div v-if="platforms.length" class="flex flex-col space-y-1">
        <a v-for="platform in platforms" :key="platform" :href="platform" target="_blank" 
        class="bg-quinary text-xs px-2 py-1 rounded truncate">
          {{ platform }}
        </a>
      </div>
      <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
        No Platforms Link
      </p>
    </div>

    <div class="flex w-full items-center justify-between">
      <p class="text-xs uppercase">Release date : <span class="font-bold">{{ releaseDate }}</span></p>
      <div class="space-x-1">
        <!-- <NuxtLink :to="'/artist/edit/' + id" target="_blank" class="bg-quinary uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Edit</NuxtLink> -->
        <button @click="deleteRelease" class="bg-quinary uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Delete</button>
      </div>
    </div>
  </div>
</template>