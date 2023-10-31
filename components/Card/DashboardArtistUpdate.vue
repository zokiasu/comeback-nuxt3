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
  <div v-if="artist" class="grid grid-rows-2 gap-2 md:grid-cols-2 md:grid-rows-none">
    <section class="list-complete-item space-y-2 rounded bg-quaternary p-3">
      <p class="border-b border-zinc-500 pb-0.5 text-center font-semibold uppercase">Original Data</p>
      <div class="relative">
        <div ref="skeleton" class="absolute inset-0 z-10 animate-pulse rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"></div>
        <nuxt-img :src="artist.image" :alt="artist.name" quality="30" loading="lazy" @load="loadingDone" class="rounded bg-zinc-500" />
      </div>
      <!-- General Info -->
      <div class="text-sm">
        <p>
          <span class="font-semibold uppercase">Name :</span>
          {{ artist.name }}
        </p>
        <p>
          <span class="font-semibold uppercase">Type :</span>
          {{ artist.type }}
        </p>
        <p>
          <span class="font-semibold uppercase">Id Youtube Music :</span>
          {{ artist.idYoutubeMusic }}
        </p>
        <p>
          <span class="font-semibold uppercase">Description :</span>
          {{ artist.description }}
        </p>
      </div>
      <!-- Styles -->
      <div class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Styles</p>
        <div v-if="artist.styles.length" class="flex gap-1">
          <p v-for="style in artist.styles" :key="style.name" class="rounded bg-quinary px-2 py-1 text-xs uppercase">
            {{ style.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Styles</p>
      </div>
      <!-- Socials -->
      <div class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Socials</p>
        <div v-if="artist.socials.length" class="flex flex-col space-y-1">
          <a v-for="social in artist.socials" :key="social" :href="social" target="_blank" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ social }}
          </a>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Socials Link</p>
      </div>
      <!-- Platforms -->
      <div class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Platforms</p>
        <div v-if="artist.platforms.length" class="flex flex-col space-y-1">
          <a v-for="platform in artist.platforms" :key="platform" :href="platform" target="_blank" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ platform }}
          </a>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
      <!-- Members -->
      <div class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Members</p>
        <div v-if="artist.members.length" class="flex flex-wrap gap-1">
          <p v-for="artist in artist.members" :key="artist.id" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ artist.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
      <!-- Groups -->
      <div class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Groups</p>
        <div v-if="artist.groups.length" class="flex flex-wrap gap-1">
          <p v-for="artist in artist.groups" :key="artist.id" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ artist.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
    </section>
    <section class="list-complete-item space-y-2 rounded bg-quaternary p-3">
      <p class="border-b border-zinc-500 pb-0.5 text-center font-semibold uppercase">Data Changed</p>
      <div v-if="image" class="relative">
        <div ref="skeleton_changed" class="absolute inset-0 z-10 animate-pulse rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"></div>
        <nuxt-img :src="image" alt="image changed" quality="30" loading="lazy" @load="loadingDoneChanged" class="rounded bg-zinc-500" />
      </div>
      <!-- General Info -->
      <div class="text-sm">
        <p v-if="name">
          <span class="font-semibold uppercase">Name :</span>
          {{ name }}
        </p>
        <p v-if="type">
          <span class="font-semibold uppercase">Type :</span>
          {{ type }}
        </p>
        <p v-if="idYoutubeMusic">
          <span class="font-semibold uppercase">Id Youtube Music :</span>
          {{ idYoutubeMusic }}
        </p>
        <p v-if="description">
          <span class="font-semibold uppercase">Description :</span>
          {{ description }}
        </p>
      </div>
      <!-- Styles -->
      <div v-if="styles" class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Styles</p>
        <div v-if="styles.length" class="flex gap-1">
          <p v-for="style in styles" :key="style.name" class="rounded bg-quinary px-2 py-1 text-xs uppercase">
            {{ style.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Styles</p>
      </div>
      <!-- Socials -->
      <div v-if="socials" class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Socials</p>
        <div v-if="socials.length" class="flex flex-col space-y-1">
          <a v-for="social in socials" :key="social" :href="social" target="_blank" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ social }}
          </a>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Socials Link</p>
      </div>
      <!-- Platforms -->
      <div v-if="platforms" class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Platforms</p>
        <div v-if="platforms.length" class="flex flex-col space-y-1">
          <a v-for="platform in platforms" :key="platform" :href="platform" target="_blank" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ platform }}
          </a>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
      <!-- Members -->
      <div v-if="members" class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Members</p>
        <div v-if="members.length" class="flex flex-wrap gap-1">
          <p v-for="member in members" :key="member.id" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ member.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
      <!-- Groups -->
      <div v-if="groups" class="space-y-2">
        <p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Groups</p>
        <div v-if="groups.length" class="flex flex-wrap gap-1">
          <p v-for="group in groups" :key="group.id" class="truncate rounded bg-quinary px-2 py-1 text-xs">
            {{ group.name }}
          </p>
        </div>
        <p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">No Platforms Link</p>
      </div>
    </section>
  </div>
</template>
