<script setup>
import { Timestamp } from 'firebase/firestore'

// récupérer les props message (string), date(any) et artist(string)
const { message, date, artist } = defineProps({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
  artist: {
    type: Object,
    required: true,
  },
})

const skeleton = ref(null)

function daysUntil(futureDate) {
  // Récupère la date d'aujourd'hui
  const today = new Date()

  // Récupère la date future
  const future = new Date(futureDate.seconds * 1000)

  // Calcule la différence en ms entre les deux dates
  const differenceInTime = future.getTime() - today.getTime()

  // Convertit la différence en ms en nombre de jours
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)

  // Retourne le nombre de jours restants
  return Math.ceil(differenceInDays)
}

function isDatePassed(date) {
  // Récupère la date d'aujourd'hui en timestamp
  const today = new Date().getTime()

  // Convertit la date entrée en paramètre en timestamp
  const inputDate = new Date(date.seconds * 1000)

  // Compare les deux timestamps
  if (isNaN(inputDate)) {
    throw new TypeError('Invalid date format')
  }
  return inputDate < today
}

function isSameDate(date) {
  // Récupère la date d'aujourd'hui en timestamp
  const today = new Date()
  // Convertit la date entrée en paramètre en timestamp
  const inputDate = new Date(date.seconds * 1000)

  if (isNaN(inputDate)) {
    throw new TypeError('Invalid date format')
  }
  // Compare les deux timestamps
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  )
}

const loadingDone = () => {
  skeleton.value.classList.add('opacity-0')
}
</script>

<template>
  <NuxtLink
    :to="`/artist/${artist.id}`"
    class="flex w-full flex-col overflow-hidden rounded-lg transition-all duration-500 ease-in-out hover:z-20 hover:scale-110 hover:drop-shadow-lg md:flex-row"
  >
    <div class="flex h-full w-full items-center space-x-5 bg-quinary py-3 md:p-3">
      <div class="relative hidden lg:block">
        <div
          ref="skeleton"
          class="absolute inset-0 z-10 mx-auto aspect-square h-10 w-10 animate-pulse rounded-full bg-zinc-500 object-cover transition-all duration-1000 ease-in-out"
        ></div>
        <nuxt-img
          :src="artist.image"
          :alt="artist.name + 's picture'"
          quality="30"
          loading="lazy"
          @load="loadingDone"
          class="shadowCard h-10 w-10 rounded-full object-cover"
        />
      </div>
      <div>
        <h2 class="text-xs font-semibold lg:text-sm">{{ artist.name }}'s news</h2>
        <p class="text-xs">{{ message }}</p>
      </div>
    </div>
    <div
      class="-mt-0.5 flex min-w-[5rem] items-center justify-center bg-quaternary px-3 py-1 text-center md:mt-0 md:py-0"
    >
      <p
        v-if="!isDatePassed(date) && !isSameDate(date)"
        class="my-auto whitespace-nowrap text-xl font-bold"
      >
        D-{{ daysUntil(date) }}
      </p>
      <p
        v-if="isSameDate(date)"
        class="my-auto whitespace-nowrap font-medium text-primary"
      >
        Today
      </p>
      <p
        v-if="!isSameDate(date) && isDatePassed(date)"
        class="my-auto whitespace-nowrap font-medium text-primary"
      >
        Outed
      </p>
    </div>
  </NuxtLink>
</template>

<style>
.shadowCard {
  --tw-shadow: 5px 5px 5px 2px rgba(0, 0, 0, 0.3);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
}
</style>
