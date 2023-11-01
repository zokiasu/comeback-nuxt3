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
const skeletonUser = ref(null)

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}

const loadingUserDone = () => {
  skeletonUser.value.classList.add('opacity-0')
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
      <div class="relative">
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
    </div>
    <div>
      <!-- <div class="space-y-2">
        <CbLabel label="User" class="border-b border-zinc-500" />
        <div class="relative">
          <div
            ref="skeletonUser"
            class="absolute h-14 z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
          ></div>
          <NuxtImg 
            v-if="user.picture"
            :src="user.picture" 
            :alt="user.name" format="webp"
            loading="lazy" 
            class="rounded h-14 object-cover" 
            @load="loadingUserDone"
          />
        </div>
        <div>
          <p class="font-semibold">{{ user.name }}</p>
          <p class="text-xs truncate">{{ user.id }}</p>
        </div>
      </div> -->
    </div>

    <div>
      <CbLabel label="Message" class="border-b border-zinc-500" />
      <p>{{ message }}</p>
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

    <div class="flex w-full justify-between">
      <p>{{ user.name }}</p>
      <p></p>
    </div>
  </div>
</template>
