<script setup>
import { Timestamp } from 'firebase/firestore';
const releases = ref(null)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const startDate = ref(new Date(currentYear.value, currentMonth.value, 1))
const endDate = ref(new Date(currentYear.value, currentMonth.value + 1, 0))

// display month name instead of number
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'
]
onMounted(async () => {
  releases.value = await fetchReleasesByMonth(Timestamp.fromDate(startDate.value), Timestamp.fromDate(endDate.value))
})

watch([currentYear, currentMonth], async () => {
  startDate.value = new Date(currentYear.value, currentMonth.value, 1)
  endDate.value = new Date(currentYear.value, currentMonth.value + 1, 0)
  releases.value = await fetchReleasesByMonth(Timestamp.fromDate(startDate.value), Timestamp.fromDate(endDate.value))
})

useHead({
  title: 'Releases Calendar',
  meta: [{
    name: 'description',
    content: 'Releases Calendar'
  }]
})
</script>

<template>
  <div class="container mx-auto min-h-screen p-5 space-y-5">
    <div class="md:flex md:justify-between">
      <p class="text-lg uppercase">Released in <span class="font-bold">{{ monthNames[currentMonth] }} {{
        currentYear }}</span></p>
      <div class="flex items-center divide-x space-x-2 divide-zinc-500 pt-1">
        <div class="flex items-center space-x-2">
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider"
            @click="currentMonth--">
            Prev Month
          </button>
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider"
            @click="currentMonth++">
            Next Month
          </button>
        </div>
        <div class="flex items-center space-x-2 pl-2">
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider"
            @click="currentYear--">Prev Year</button>
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider"
            @click="currentYear++">Next Year</button>
        </div>
      </div>
    </div>
    <transition-group name="list" tag="div" class="flex flex-wrap items-center justify-between lg:justify-center gap-5">
      <LazyCardRelease v-for="release in releases" :key="release.id" :id="release.id" :image="release.image"
        :date="release.date" :name="release.name" :type="release.type" :artistsId="release.artistsId"
        :artistsName="release.artistsName" :displayDate="true" />
    </transition-group>
    <div class="md:hidden">
      <p class="text-lg font-semibold uppercase">Released in June 2023</p>
      <div class="flex items-center divide-x space-x-2 divide-zinc-500 pt-1">
        <div class="flex items-center space-x-2">
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider">Prev
            Month</button>
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider">Next
            Month</button>
        </div>
        <div class="flex items-center space-x-2 pl-2">
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider">Prev
            Year</button>
          <button
            class="text-[0.6rem] capitalize rounded border py-0.5 px-1 transition-all duration-300 ease-in-out hover:bg-zinc-500 tracking-wider">Next
            Year</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active {
  transition: all 1s ease;
}

.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>