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
  <div class="list-complete-item h-full bg-quaternary p-3 rounded space-y-2.5 relative">
    <p>
      News ID : {{ id }}
    </p>
    <div class="grid grid-cols-2 gap-5">
      <div class="space-y-2">
        <CbLabel label="Artist" class="border-b border-zinc-500" />
        <div class="relative">
          <div
            ref="skeleton"
            class="absolute h-14 z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
          ></div>
          <nuxt-img 
            v-if="artist.image"
            :src="artist.image" 
            :alt="artist.name" 
            quality="30" 
            loading="lazy" 
            class="rounded h-14" 
            @load="loadingDone"
          />
        </div>
        <div>
          <p class="font-semibold">{{ artist.name }}</p>
          <p class="text-xs">{{ artist.id }}</p>
        </div>
      </div>
      <div class="space-y-2">
        <CbLabel label="User" class="border-b border-zinc-500" />
        <div class="relative">
          <div
            ref="skeletonUser"
            class="absolute h-14 z-10 inset-0 rounded bg-zinc-500 object-cover transition-all duration-1000 ease-in-out animate-pulse"
          ></div>
          <nuxt-img 
            v-if="user.picture"
            :src="user.picture" 
            :alt="user.name" 
            quality="30" 
            loading="lazy" 
            class="rounded h-14 object-cover" 
            @load="loadingUserDone"
          />
        </div>
        <div>
          <p class="font-semibold">{{ user.name }}</p>
          <p class="text-xs truncate">{{ user.id }}</p>
        </div>
      </div>
    </div>
    
    <div>
      <CbLabel label="Message" class="border-b border-zinc-500" />
      <p>{{ message }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- <button class="bg-quinary rounded px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30">
      Edit
    </button> -->
      <button @click="deleteNews" class="bg-quinary rounded px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30">
        Delete
      </button>
    </div>
  </div>
</template>