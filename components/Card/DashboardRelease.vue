<script setup>
import * as Mdl from '@kouts/vue-modal'
import VueDatePicker from '@vuepic/vue-datepicker'
import { useToast } from 'vue-toastification'
import { Timestamp } from 'firebase/firestore'

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

const emit = defineEmits(['deleteRelease'])
const toast = useToast()
const { updateRelease } = useFirebaseFunction()
const toastOption = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
}

const { Modal } = Mdl
const skeleton = ref(null)
const showModal = ref(false)

const dateToChange = ref(null)
const yearToChange = ref(null)

const releaseDate = computed(() => {
  let dateComputed = new Date()
  if (date.value) dateComputed = new Date(date.value.seconds * 1000)
  // return dateComputed format to DD-MM-YYYY
  return `${dateComputed.getDate()}-${
    dateComputed.getMonth() + 1
  }-${dateComputed.getFullYear()}`
})

const dateToTestYear = date.value ? new Date(date.value.seconds * 1000) : new Date()

const doubleCheckYear = computed(() => {
  if (yearReleased !== dateToTestYear.getFullYear()) return true
  return false
})

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}

const deleteRelease = () => {
  emit('deleteRelease', id)
}

const showUpdateVerifiedRelease = () => {
  showModal.value = true
}

const validVerifiedRelease = () => {
  const dataToChange = {}
  dataToChange['id'] = id

  if (dateToChange.value) {
    // add dataToChange
    dataToChange['date'] = Timestamp.fromDate(new Date(dateToChange.value))
  }

  if (yearToChange.value) {
    // add yearToChange
    dataToChange['year'] = yearToChange.value
  }

  dataToChange['needToBeVerified'] = false

  updateRelease(id, dataToChange).then(() => {
    showModal.value = false
    toast.success('Release Updated', toastOption)
  })
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
      v-if="needToBeVerified || doubleCheckYear"
      class="absolute z-50 rounded-full bg-red-500 px-2 text-xs font-semibold"
    >
      Need To Be Verified
    </p>

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
        class="w-full rounded"
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
          v-if="needToBeVerified || doubleCheckYear"
          @click="showUpdateVerifiedRelease"
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

    <Modal
      v-model="showModal"
      :title="`Fix Release ${artistsName} - ${name}`"
      wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <div class="space-y-2">
        <p>Actual Date : {{ releaseDate }}</p>
        <VueDatePicker v-model="dateToChange" auto-apply :enable-time-picker="false" />
        <p>Actual Year : {{ yearReleased }}</p>
        <CbInput
          label="Year"
          :placeholder="yearReleased.toString()"
          v-model="yearToChange"
        />
        <button
          @click="validVerifiedRelease"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
        >
          Verified
        </button>
      </div>
    </Modal>
  </div>
</template>
