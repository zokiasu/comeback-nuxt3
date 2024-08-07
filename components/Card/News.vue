<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';
import { Timestamp } from 'firebase/firestore';

// récupérer les props message (string), date(any) et artist(string)
const { message, date, artist, artists } = defineProps({
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
    required: false,
  },
  artists: {
    type: Array,
    required: false,
  },
});

const skeleton = ref(null);

function daysUntil(futureDate) {
  const today = new Date();
  const future = new Date(futureDate.seconds * 1000);
  const differenceInTime = future.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.ceil(differenceInDays);
}

function isDatePassed(date) {
  const today = new Date().getTime();
  const inputDate = new Date(date.seconds * 1000);
  if (isNaN(inputDate)) {
    throw new TypeError('Invalid date format');
  }
  return inputDate < today;
}

function isSameDate(date) {
  const today = new Date();
  const inputDate = new Date(date.seconds * 1000);
  if (isNaN(inputDate)) {
    throw new TypeError('Invalid date format');
  }
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}

const loadingDone = () => {
  if (skeleton.value) {
    skeleton.value.classList.add('opacity-0');
  }
};

const handleError = (artistName) => {
  console.error('Failed to load image', artistName);
};
</script>

<template>
  <div class="flex justify-between w-full overflow-hidden transition-all duration-500 ease-in-out rounded">
    <section class="w-full h-full p-2 space-y-1 overflow-hidden shrink bg-quinary">
      <div class="flex flex-wrap gap-1">
        <NuxtLink v-if="artist" :to="`/artist/${artist.id}`" class="flex items-center gap-2 group">
          <div class="relative hidden lg:block">
            <div
              ref="skeleton"
              class="absolute inset-0 z-10 object-cover w-4 h-4 mx-auto transition-all duration-1000 ease-in-out rounded-lg aspect-square bg-primary"
            ></div>
            <NuxtImg
              :src="artist.image"
              :alt="artist.name + '\'s picture'"
              format="webp"
              @load="loadingDone"
              @error="handleError"
              class="object-cover w-4 h-4 rounded-full"
            />
          </div>
          <h2
            class="text-xs font-semibold truncate transition-all duration-300 ease-in-out group-hover:text-primary lg:text-sm"
          >
            {{ artist.name }}
          </h2>
        </NuxtLink>
        <NuxtLink v-else v-for="(artistObject, index) in artists" :key="artistObject.id" :to="`/artist/${artistObject.id}`" class="flex items-center gap-2 group">
          <div class="relative hidden lg:block">
            <div
              ref="skeleton"
              class="absolute inset-0 z-10 object-cover w-4 h-4 mx-auto transition-all duration-1000 ease-in-out rounded-lg aspect-square bg-primary"
            ></div>
            <NuxtImg
              :src="artistObject.image"
              :alt="artistObject.name + 's picture'"
              format="webp"
              @load="loadingDone"
              @error="handleError(artistObject.name)"
              class="object-cover w-4 h-4 rounded-full"
            />
          </div>
          <h2
            class="text-xs font-semibold truncate transition-all duration-300 ease-in-out group-hover:text-primary lg:text-sm"
          >
            {{ artistObject.name }}<span v-if="artists.length > 1 && index != (artists.length - 1)" class="group-hover:text-tertiary">, </span>
          </h2>
        </NuxtLink>
      </div>
      <p class="text-xs truncate">{{ message }}</p>
    </section>
    
    <section
      class="-mt-0.5 flex min-w-[18%] items-center justify-center bg-quaternary px-3 py-1 text-center md:mt-0 md:py-0"
    >
      <p
        v-if="!isDatePassed(date) && !isSameDate(date)"
        class="my-auto text-lg font-bold whitespace-nowrap lg:text-xl"
      >
        D-{{ daysUntil(date) }}
      </p>
      <p
        v-if="isSameDate(date)"
        class="my-auto font-medium whitespace-nowrap text-primary"
      >
        Today
      </p>
      <p
        v-if="!isSameDate(date) && isDatePassed(date)"
        class="my-auto font-medium whitespace-nowrap text-primary"
      >
        Outed
      </p>
    </section>
  </div>
</template>

<style>
.shadowCard {
  --tw-shadow: 5px 5px 5px 2px rgba(0, 0, 0, 0.3);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
}
</style>
