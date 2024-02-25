<script setup>
const { id, message, artist, date, user, verified } = defineProps({
  id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  artist: {
    type: Object,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
})

const skeleton = ref(null)

const loadingDone = () => {
  if(skeleton.value) skeleton.value.classList.add('opacity-0')
}

const convertDate = (timestamp) => {
  const date = new Date(timestamp?.seconds * 1000)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const emit = defineEmits(['deleteNews'])

const deleteNews = () => {
  emit('deleteNews', id)
}
</script>

<template>
  <div class="list-complete-item relative h-full space-y-2.5 rounded bg-quaternary p-3">
    <div class="space-y-2">
      <div class="flex w-full justify-between border-b border-zinc-500">
        <p class="font-semibold">{{ artist.name }}</p>
        <NuxtLink :to="'/artist/' + artist.id" target="_blank">{{ artist.id }}</NuxtLink>
      </div>
      <NuxtImg
        v-if="artist.image"
        :src="artist.image"
        :alt="artist.name"
        format="webp"
        loading="lazy"
        class="rounded"
        @load="loadingDone"
      />
    </div>

    <div>
      <ComebackLabel label="Message" class="border-b border-zinc-500" />
      <p>{{ message }}</p>
    </div>

    <div>
      <ComebackLabel label="Date" class="border-b border-zinc-500" />
      <p>{{ convertDate(date) }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        disabled
        class="rounded bg-quinary px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30"
      >
        Edit
      </button>
      <button
        @click="deleteNews"
        class="rounded bg-quinary px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30"
      >
        Delete
      </button>
    </div>
  </div>
</template>
