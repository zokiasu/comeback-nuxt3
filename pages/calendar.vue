<script setup>
import { Timestamp } from 'firebase/firestore'
const releases = ref(null)
const backTop = ref(null)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const startDate = ref(new Date(currentYear.value, currentMonth.value, 1))
const endDate = ref(new Date(currentYear.value, currentMonth.value + 1, 0))

// display month name instead of number
const monthList = [
  { minify:'Jan', original:'January' },
  { minify:'Feb', original:'February' },
  { minify:'Mar', original:'March' },
  { minify:'Apr', original:'April' },
  { minify:'May', original:'May' },
  { minify:'Jun', original:'June' },
  { minify:'Jul', original:'July' },
  { minify:'Aug', original:'August' },
  { minify:'Sep', original:'September' },
  { minify:'Oct', original:'October' },
  { minify:'Nov', original:'November' },
  { minify:'Dec', original:'December' },
]
const yearList = ref([])

onMounted(async () => {
  for (let year = 2020; year <= currentYear.value; year++) {
    yearList.value.push(year)
  }

  fetchReleasesByMonth(
    Timestamp.fromDate(startDate.value),
    Timestamp.fromDate(endDate.value),
  ).then(releasesData => {
    releases.value = releasesData
  })

  window.addEventListener('scroll', handleScrollCalendar)
})

function handleScrollCalendar() {
  if(backTop.value){
    if (window.scrollY > 50) {
      backTop.value.classList.remove('hidden')
    } else {
      backTop.value.classList.add('hidden')
    }
  }
}

watch([currentYear, currentMonth], async () => {
  startDate.value = new Date(currentYear.value, currentMonth.value, 1)
  endDate.value = new Date(currentYear.value, currentMonth.value + 1, 0)
  releases.value = await fetchReleasesByMonth(
    Timestamp.fromDate(startDate.value),
    Timestamp.fromDate(endDate.value),
  )
})

useHead({
  title: 'Releases Calendar',
  meta: [
    {
      name: 'description',
      content: 'Releases Calendar',
    },
  ],
})
</script>

<template>
  <div class="container mx-auto min-h-screen w-full h-fit space-y-1 p-3 md:p-5">
    <div class="flex w-full gap-1 text-xs font-semibold snap-x snap-mandatory overflow-x-auto">
      <button
        :id="year" 
        v-for="year in yearList"
        :key="year"
        @click="currentYear = year"
        class="w-full h-full px-4 py-2.5 rounded snap-start"
        :class="(currentYear == year) ? 'bg-primary':'bg-quaternary'"
      >
        {{ year }}
      </button>
    </div>
    <div class="flex w-full gap-1 text-xs font-semibold snap-x snap-mandatory overflow-x-auto">
      <button
        :id="month.original" 
        v-for="(month, index) in monthList"
        :key="month.original"
        @click="currentMonth = index"
        class="w-full h-full px-4 py-2.5 rounded snap-start"
        :class="(currentMonth == index) ? 'bg-primary':'bg-quaternary'"
      >
        <p class="block md:hidden">{{ month.minify }}</p>
        <p class="hidden md:block">{{ month.original }}</p>
      </button>
    </div>
    <transition-group
      name="fade"
      tag="div"
      @before-enter="beforeEnter"
      @beforeLeave="beforeLeave"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5 md:gap-3.5 pt-5"
    >
      <CardObject
        v-for="release in releases"
        :key="release.id"
        :artistId="release.artistsId"
        :mainTitle="release.name"
        :subTitle="release.artistsName"
        :image="release.image"
        :releaseDate="release.date"
        :releaseType="release.type"
        :objectLink="`/release/${release.id}`"
        dateAlwaysDisplay
        class="!min-w-full"
      />
    </transition-group>
    <div class="sticky w-full text-end bottom-16 md:bottom-5 xl:bottom-0">
      <a href="#" ref="backTop" class="bg-quaternary w-fit shadow shadow-zinc-700 xl:absolute xl:bottom-3 lg:-right-20 2xl:-right-28 px-4 py-2.5 text-xs font-semibold hidden">
        Back to top
      </a>
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
