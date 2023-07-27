<script setup>
const { id, taskId, image, name, description, type, idYoutubeMusic, styles, socials, platforms, groups, members } = defineProps({
  id: {
    type: String,
    required: true,
  },
  taskId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  idYoutubeMusic: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  styles: {
    type: Array,
    required: false,
  },
  socials: {
    type: Array,
    required: false,
  },
  platforms: {
    type: Array,
    required: false,
  },
  groups: {
    type: Array,
    required: false,
  },
  members: {
    type: Array,
    required: false,
  },
})

const artist = ref(null)

const skeleton = ref(null)
const skeleton_changed = ref(null)

onMounted(async () => {
  artist.value = await fetchArtistFullInfoById(id)
})

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}
const loadingDoneChanged = () => {
  skeleton_changed.value.classList.add('opacity-0')
}
</script>

<template>
  <div v-if="artist" class="grid gap-2 grid-rows-2 md:grid-cols-2 md:grid-rows-none">
    <section class="list-complete-item bg-quaternary p-3 rounded space-y-2">
      <p class="font-semibold text-center uppercase border-b border-zinc-500 pb-0.5">Original Data</p>
      <div class="relative">
        <div
          ref="skeleton"
          class="absolute z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
        ></div>
        <nuxt-img 
          :src="artist.image"
          :alt="artist.name"
          quality="30"
          loading="lazy" 
          @load="loadingDone"
          class="rounded bg-zinc-500"
        />
      </div>
      <!-- General Info -->
      <div class="text-sm">
        <p>
          <span class="font-semibold uppercase">Name :</span> {{ artist.name }}
        </p>
        <p>
          <span class="font-semibold uppercase">Type :</span> {{ artist.type }}
        </p>
        <p>
          <span class="font-semibold uppercase">Id Youtube Music :</span> {{ artist.idYoutubeMusic }}
        </p>
        <p>
          <span class="font-semibold uppercase">Description :</span> {{ artist.description }}
        </p>
      </div>
      <!-- Styles -->
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Styles</p>
        <div v-if="artist.styles.length" class="flex gap-1">
          <p v-for="style in artist.styles" :key="style.name" class="bg-quinary uppercase text-xs px-2 py-1 rounded">
            {{ style.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Styles
        </p>
      </div>
      <!-- Socials -->
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Socials</p>
        <div v-if="artist.socials.length" class="flex flex-col space-y-1">
          <a v-for="social in artist.socials" :key="social" :href="social" target="_blank" class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ social }}
          </a>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Socials Link
        </p>
      </div>
      <!-- Platforms -->
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Platforms</p>
        <div v-if="artist.platforms.length" class="flex flex-col space-y-1">
          <a v-for="platform in artist.platforms" :key="platform" :href="platform" target="_blank" 
          class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ platform }}
          </a>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Platforms Link
        </p>
      </div>
      <!-- Members -->
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Members</p>
        <div v-if="artist.members.length" class="flex flex-wrap gap-1">
          <p v-for="artist in artist.members" :key="artist.id" 
          class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ artist.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Platforms Link
        </p>
      </div>
      <!-- Groups -->
      <div class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Groups</p>
        <div v-if="artist.groups.length" class="flex flex-wrap gap-1">
          <p v-for="artist in artist.groups" :key="artist.id" 
          class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ artist.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Platforms Link
        </p>
      </div>
    </section>
    <section class="list-complete-item bg-quaternary p-3 rounded space-y-2">
      <p class="font-semibold text-center uppercase border-b border-zinc-500 pb-0.5">Data Changed</p>
      <div v-if="image" class="relative">
        <div
          ref="skeleton_changed"
          class="absolute z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
        ></div>
        <nuxt-img
          :src="image"
          alt="image changed"
          quality="30"
          loading="lazy"
          @load="loadingDoneChanged"
          class="rounded bg-zinc-500"
        />
      </div>
      <!-- General Info -->
      <div class="text-sm">
        <p v-if="name">
          <span class="font-semibold uppercase">Name :</span> {{ name }}
        </p>
        <p v-if="type">
          <span class="font-semibold uppercase">Type :</span> {{ type }}
        </p>
        <p v-if="idYoutubeMusic">
          <span class="font-semibold uppercase">Id Youtube Music :</span> {{ idYoutubeMusic }}
        </p>
        <p v-if="description">
          <span class="font-semibold uppercase">Description :</span> {{ description }}
        </p>
      </div>
      <!-- Styles -->
      <div v-if="styles" class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Styles</p>
        <div v-if="styles.length" class="flex gap-1">
          <p v-for="style in styles" :key="style.name" class="bg-quinary uppercase text-xs px-2 py-1 rounded">
            {{ style.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Styles
        </p>
      </div>
      <!-- Socials -->
      <div v-if="socials" class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Socials</p>
        <div v-if="socials.length" class="flex flex-col space-y-1">
          <a v-for="social in socials" :key="social" :href="social" target="_blank" class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ social }}
          </a>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Socials Link
        </p>
      </div>
      <!-- Platforms -->
      <div v-if="platforms" class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Platforms</p>
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
      <!-- Members -->
      <div v-if="members" class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Members</p>
        <div v-if="members.length" class="flex flex-wrap gap-1">
          <p v-for="member in members" :key="member.id" 
          class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ member.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Platforms Link
        </p>
      </div>
      <!-- Groups -->
      <div v-if="groups" class="space-y-2">
        <p class="text-sm font-semibold uppercase border-b border-zinc-500 pb-1">Groups</p>
        <div v-if="groups.length" class="flex flex-wrap gap-1">
          <p v-for="group in groups" :key="group.id" 
          class="bg-quinary text-xs px-2 py-1 rounded truncate">
            {{ group.name }}
          </p>
        </div>
        <p v-else class="bg-quinary text-xs text-center uppercase px-2 py-1 rounded">
          No Platforms Link
        </p>
      </div>
    </section>
  </div>
</template>