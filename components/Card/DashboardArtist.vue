<script setup>
const {
  id,
  image,
  name,
  description,
  type,
  idYoutubeMusic,
  styles,
  socialList,
  platformList,
  createdAt,
} = defineProps({
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
  socialList: {
    type: Array,
    required: true,
  },
  platformList: {
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
  <div class="list-complete-item relative h-full space-y-3 rounded bg-quaternary p-3">
    <div class="relative">
      <div
        ref="skeleton"
        class="absolute inset-0 z-10 animate-pulse rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"
      ></div>
      <NuxtImg
        :src="image"
        :alt="name"
        format="webp"
        loading="lazy"
        @load="loadingDone"
        class="aspect-video w-full rounded bg-zinc-500 object-cover"
      />
    </div>

    <div class="flex w-full items-center justify-between">
      <div>
        <p class="space-x-1">
          <NuxtLink
            :to="'/artist/' + id"
            target="_blank"
            class="font-semibold hover:text-primary"
          >
            {{ name }}
          </NuxtLink>
          <span class="text-xs">[ {{ type }} ]</span>
        </p>
        <p class="text-xs">
          {{ idYoutubeMusic }}
        </p>
      </div>
      <div class="space-x-1">
        <NuxtLink
          :to="'/artist/edit/' + id"
          target="_blank"
          class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
        >
          Edit
        </NuxtLink>
        <button
          @click="deleteArtist"
          class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="styles" class="flex gap-1">
      <p
        v-for="style in styles"
        :key="style.name"
        class="rounded bg-quinary px-2 py-1 text-xs uppercase"
      >
        {{ style.name }}
      </p>
    </div>

    <p v-if="description" class="text-xs">
      {{ description }}
    </p>

    <div class="space-y-2">
      <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Socials</p>
      <div v-if="socialList.length" class="flex flex-col space-y-1.5">
        <a
          v-for="social in socialList"
          :key="social"
          :href="social.link"
          target="_blank"
          class="overflow-hidden rounded bg-quinary text-xs"
        >
          <p class="bg-secondary px-1.5 py-1 uppercase">{{ social.name }}</p>
          <p class="px-1.5 py-1">{{ social.link }}</p>
        </a>
      </div>
      <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
        No Socials Link
      </p>
    </div>

    <div class="space-y-2">
      <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">
        Platforms
      </p>
      <div v-if="platformList.length" class="flex flex-col space-y-1 overflow-hidden">
        <a
          v-for="platform in platformList"
          :key="platform"
          :href="platform.link"
          target="_blank"
          class="overflow-hidden rounded bg-quinary text-xs"
        >
          <p class="bg-secondary px-1.5 py-1 uppercase">{{ platform.name }}</p>
          <p class="px-1.5 py-1">{{ platform.link }}</p>
        </a>
      </div>
      <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
        No Platforms Link
      </p>
    </div>

    <p>
      {{ createdAtDate }}
    </p>
  </div>
</template>
