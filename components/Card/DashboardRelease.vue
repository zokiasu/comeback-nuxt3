<script setup>
const {
  id,
  artistsName,
  createdAt,
  date,
  idYoutubeMusic,
  image,
  name,
  needToBeVerified,
  platforms,
  type,
  yearReleased,
} = defineProps({
  id: {
    type: String,
    required: true,
  },
  artistsName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Object,
    required: true,
  },
  date: {
    type: Object,
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
    type: Number,
    required: true,
  },
})

const skeleton = ref(null)

const releaseDate = new Date(date.seconds * 1000).toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}

const emit = defineEmits(['deleteRelease', 'verifiedRelease'])

const deleteRelease = () => {
  emit('deleteRelease', id)
}

const verifiedRelease = () => {
  emit('verifiedRelease', id)
}
</script>

<template>
  <div class="list-complete-item relative h-full space-y-1.5 rounded bg-quaternary p-3">
    <div class="flex w-full justify-between text-sm">
      <div class="flex gap-1">
        <p>[ {{ type }} ]</p>
        <p>[ {{ yearReleased }} ]</p>
      </div>
      <p>
        {{ idYoutubeMusic }}
      </p>
    </div>

    <p
      v-if="needToBeVerified"
      class="absolute z-50 rounded-full bg-red-500 px-2 text-xs font-semibold"
    >
      Need To Be Verified
    </p>

    <div class="relative">
      <div
        ref="skeleton"
        class="absolute inset-0 z-10 animate-pulse rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"
      ></div>
      <nuxt-img
        :src="image"
        :alt="name"
        quality="30"
        loading="lazy"
        class="rounded"
        @load="loadingDone"
      />
    </div>

    <div>
      <NuxtLink
        :to="'/release/' + id"
        target="_blank"
        class="font-semibold transition-all duration-300 ease-in-out hover:text-primary"
      >
        {{ name }}
      </NuxtLink>
      <p class="border-t border-zinc-500">{{ artistsName }}</p>
    </div>

    <div class="space-y-2 pt-2">
      <p class="border-b border-zinc-500 pb-1 text-xs font-semibold uppercase">
        Platforms
      </p>
      <div v-if="platforms.length" class="flex flex-col space-y-1">
        <a
          v-for="platform in platforms"
          :key="platform"
          :href="platform"
          target="_blank"
          class="truncate rounded bg-quinary px-2 py-1 text-xs"
        >
          {{ platform }}
        </a>
      </div>
      <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
        No Platforms Link
      </p>
    </div>

    <div class="flex w-full items-center justify-between">
      <p class="text-xs uppercase">
        Release date :
        <span class="font-bold">{{ releaseDate }}</span>
      </p>
      <div class="space-x-1">
        <!-- <NuxtLink :to="'/release/edit/' + id" target="_blank" class="bg-quinary uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Edit</NuxtLink> -->
        <button
          @click="verifiedRelease"
          class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
        >
          Verified
        </button>
        <button
          @click="deleteRelease"
          class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
