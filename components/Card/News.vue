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
    class="group flex w-full overflow-hidden rounded transition-all duration-500 ease-in-out hover:drop-shadow-lg"
  >
    <div class="flex gap-2 h-full min-w-[82%] md:max-w-[82%] overflow-hidden items-center md:space-x-3 bg-quinary py-1 px-3 sm:p-2">
      <div class="relative hidden sm:block">
        <div
          ref="skeleton"
          class="absolute inset-0 z-10 mx-auto aspect-square h-8 w-8 rounded-lg bg-primary object-cover transition-all duration-1000 ease-in-out"
        ></div>
        <NuxtImg
          :src="artist.image"
          :alt="artist.name + 's picture'"
          format="webp"
          loading="lazy"
          @load="loadingDone"
          class="h-8 w-8 min-w-8 rounded-full object-cover"
        />
      </div>
      <div class="flex gap-1 w-full md:pr-5 items-center">
        <h2
          class="text-xs font-semibold transition-all duration-300 ease-in-out group-hover:text-primary lg:text-sm"
        >
          {{ artist.name }}
        </h2>
        <p>-</p>
        <p class="text-xs truncate">{{ message }}</p>
      </div>
    </div>
    <div
      class="-mt-0.5 flex min-w-[18%] items-center justify-center bg-quaternary px-3 py-1 text-center md:mt-0 md:py-0"
    >
      <p
        v-if="!isDatePassed(date) && !isSameDate(date)"
        class="my-auto whitespace-nowrap text-lg md:text-xl font-bold"
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
