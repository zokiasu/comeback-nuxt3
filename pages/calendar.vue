<script setup>
import { Timestamp } from 'firebase/firestore'

const releases = ref([])
const backTop = ref(null)
const yearList = ref([])
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
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const startDate = ref(new Date(currentYear.value, currentMonth.value, 1))
const endDate = ref(new Date(currentYear.value, currentMonth.value + 1, 0))
const { getReleasesBetweenDates } = useFirebaseFunction()
const onlyAlbums = ref(false)
const onlyEps = ref(false)
const onlySingles = ref(false)

function handleScrollCalendar() {
  if(backTop.value){
    if (window.scrollY > 50) {
      backTop.value.classList.remove('hidden')
    } else {
      backTop.value.classList.add('hidden')
    }
  }
}

const switchTypeFilter = async (type) => {
  if(type === 'ALBUM') {
    onlyAlbums.value = true
    onlyEps.value = false
    onlySingles.value = false
  } else if(type === 'EP') {
    onlyAlbums.value = false
    onlyEps.value = true
    onlySingles.value = false
  } else if(type === 'SINGLE') {
    onlyAlbums.value = false
    onlyEps.value = false
    onlySingles.value = true
  } else {
    onlyAlbums.value = false
    onlyEps.value = false
    onlySingles.value = false
  }
}

const releasesDisplayed = computed(() => {
  if(onlyAlbums.value) {
    return releases.value.filter((release) => release.type === 'ALBUM')
  } else if(onlyEps.value) {
    return releases.value.filter((release) => release.type === 'EP')
  } else if(onlySingles.value) {
    return releases.value.filter((release) => release.type === 'SINGLE')
  } else {
    return releases.value
  }
})

// function backtotop to id calendarPage
const backToTop = () => {
  document.getElementById('__nuxt').scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  for (let year = 2020; year <= currentYear.value; year++) {
    yearList.value.push(year)
  }

  releases.value = await getReleasesBetweenDates(
    Timestamp.fromDate(startDate.value),
    Timestamp.fromDate(endDate.value),
  )

  window.addEventListener('scroll', handleScrollCalendar)
})

watch([currentYear, currentMonth], async () => {
  startDate.value = new Date(currentYear.value, currentMonth.value, 1)
  endDate.value = new Date(currentYear.value, currentMonth.value + 1, 0)
  releases.value = await getReleasesBetweenDates(Timestamp.fromDate(startDate.value), Timestamp.fromDate(endDate.value))
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
  <div id="calendarPage" class="container mx-auto min-h-screen w-full h-fit space-y-3 p-3 md:p-5">
    <!-- Period Selector -->
    <div>
      <!-- Year Selector -->
      <div class="remove-scrollbar flex w-full gap-1 text-xs font-semibold snap-x snap-mandatory overflow-x-auto pb-1 scrollBarLight">
        <button
          :id="year" 
          v-for="year in yearList"
          :key="year"
          @click="currentYear = year; switchTypeFilter('ALL');"
          class="w-full h-full px-4 py-2.5 rounded snap-start"
          :class="(currentYear == year) ? 'bg-primary':'bg-quaternary'"
        >
          {{ year }}
        </button>
      </div>
      <!-- Month Selector -->
      <div v-if="yearList.length" class="remove-scrollbar flex w-full gap-1 text-xs font-semibold snap-x snap-mandatory overflow-x-auto pb-1 scrollBarLight">
        <button
          :id="month.original" 
          v-for="(month, index) in monthList"
          :key="month.original"
          @click="currentMonth = index; switchTypeFilter('ALL');"
          class="w-full h-full px-4 py-2.5 rounded snap-start"
          :class="(currentMonth == index) ? 'bg-primary':'bg-quaternary'"
        >
          <p class="block md:hidden">{{ month.minify }}</p>
          <p class="hidden md:block">{{ month.original }}</p>
        </button>
      </div>
    </div>
    <!-- Stats -->
    <div class="border-y-2 text-xs border-quaternary py-3 space-y-2">
      <!-- <p class="font-semibold text-base text-center">
        {{ monthList[currentMonth].original }} {{ currentYear }}'s stats
      </p> -->
      <div class="grid grid-cols-4 gap-1 lg:gap-5 justify-center items-center">
        <button 
          @click="switchTypeFilter('ALL')" 
          class="w-full h-full flex flex-col justify-center items-center bg-primary rounded py-1 px-2" 
          :class="(!onlyAlbums && !onlyEps && !onlySingles) ? 'bg-primary':'bg-quaternary'"
        >
          Total releases <span class="font-bold text-base">{{ releases.length }}</span>
        </button>
        <button @click="switchTypeFilter('ALBUM')" 
          class="w-full h-full flex flex-col justify-center items-center bg-primary rounded py-1 px-2" 
          :class="(onlyAlbums && !onlyEps && !onlySingles) ? 'bg-primary':'bg-quaternary'"
        >
          Total albums <span class="font-bold text-base">{{ releases.filter(release => release.type === 'ALBUM').length }}</span>
        </button>
        <button @click="switchTypeFilter('EP')" 
          class="w-full h-full flex flex-col justify-center items-center bg-primary rounded py-1 px-2" 
          :class="(!onlyAlbums && onlyEps && !onlySingles) ? 'bg-primary':'bg-quaternary'"
        >
          Total EPs <span class="font-bold text-base">{{ releases.filter(release => release.type === 'EP').length }}</span>
        </button>
        <button @click="switchTypeFilter('SINGLE')" 
          class="w-full h-full flex flex-col justify-center items-center bg-primary rounded py-1 px-2" 
          :class="(!onlyAlbums && !onlyEps && onlySingles) ? 'bg-primary':'bg-quaternary'"
        >
          Total singles <span class="font-bold text-base">{{ releases.filter(release => release.type === 'SINGLE').length }}</span>
        </button>
      </div>
    </div>
    <!-- <p class="text-primary text-sm italic">Some troubles have been noticed with our release recovery API and are working to resolve them quickly. We apologize for the inconvenience.</p> -->
    <!-- Releases -->
    <transition-group
      tag="div"
      leave-active-class="animate__bounceOut"
      enter-active-class="animate__bounceIn"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3.5"
    >
      <CardObject
        v-for="release in releasesDisplayed"
        :key="release.idYoutubeMusic"
        :artistId="release.artistsId"
        :mainTitle="release.name"
        :subTitle="release.artistsName"
        :image="release.image"
        :releaseDate="release.date"
        :releaseType="release.type"
        :objectLink="`/release/${release.idYoutubeMusic}`"
        dateAlwaysDisplay
        class="!min-w-full"
      />
    </transition-group>
    <!-- Back to top -->
    <div ref="backTop" class="sticky w-full text-center py-5 bottom-12 lg:bottom-0 hidden">
      <button @click="backToTop" class="bg-quaternary w-fit shadow shadow-zinc-700 px-4 py-2.5 text-xs font-semibold">
        Back to top
      </button>
    </div>
  </div>
</template>
