<script setup>
const { id, image, name, description, type, idYoutubeMusic, styles, socials, platforms, createdAt } = defineProps({
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
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  idYoutubeMusic: {
    type: String,
    required: true,
  },
  styles: {
    type: Array,
    required: true,
  },
  socials: {
    type: Array,
    required: true,
  },
  platforms: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Object,
    required: true,
  },
})

const skeleton = ref(null)

const createdAtDate = new Date(createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const emit = defineEmits(['deleteArtist'])
const deleteArtist = () => {
  emit('deleteArtist', id)
}

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}
</script>

<template>
  <div class="list-complete-item h-full bg-quaternary p-3 rounded space-y-3 relative">
    <div class="relative">
      <div
        ref="skeleton"
        class="absolute z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
      ></div>
      <nuxt-img 
        :src="image" 
        :alt="name" 
        quality="30" 
        loading="lazy"  
        @load="loadingDone"
        class="rounded bg-zinc-500 aspect-video object-cover"
      />
    </div>
    <div class="flex w-full items-center justify-between">
      <div>
        <p class="space-x-1">
          <span class="font-semibold">{{ name }}</span> 
          <span class="text-xs">[ {{ type }} ]</span>
        </p>
        <p class="text-xs">
          {{ idYoutubeMusic }}
        </p>
      </div>
      <div class="space-x-1">
        <NuxtLink :to="'/artist/edit/' + id" target="_blank" class="bg-quinary uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Edit</NuxtLink>
        <button @click="deleteArtist" class="bg-quinary uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Delete</button>
      </div>
    </div>

    <div v-if="styles" class="flex gap-1">
      <p v-for="style in styles" :key="style.name" class="bg-quinary uppercase text-xs px-2 py-1 rounded">
        {{ style.name }}
      </p>
    </div>

    <p v-if="description" class="text-xs">
      {{ description }}
    </p>

    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Socials</p>
      <div v-if="socials.length" class="flex flex-col space-y-1">
        <a v-for="social in socials" :key="social" :href="social" target="_blank" class="bg-quinary text-xs px-2 py-1 rounded">
          {{ social }}
        </a>
      </div>
      <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
        No Socials Link
      </p>
    </div>

    <div class="space-y-2">
      <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Platforms</p>
      <div v-if="platforms.length" class="flex flex-col space-y-1 overflow-hidden">
        <a v-for="platform in platforms" :key="platform" :href="platform" target="_blank" 
        class="bg-quinary text-xs px-2 py-1 rounded">
          {{ platform }}
        </a>
      </div>
      <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
        No Platforms Link
      </p>
    </div>

    <p>
      {{ createdAtDate }}
    </p>
  </div>
</template>