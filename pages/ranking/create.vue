<template>
  <div class="container mx-auto space-y-3 min-h-dvh-wo-nav max-h-dvh-wo-nav">
    <h1 class="font-semibold text-2xl">Create Ranking</h1>
    <div class="flex gap-2 text-xl">
      <button @click="changeYearFilter(2020)" class="text-white p-3 w-full rounded" :class="yearFilter === 2020 ? 'bg-primary' : 'bg-quinary'"  >
        2020
      </button>
      <button @click="changeYearFilter(2021)" class="text-white p-3 w-full rounded" :class="yearFilter === 2021 ? 'bg-primary' : 'bg-quinary'"  >
        2021
      </button>
      <button @click="changeYearFilter(2022)" class="text-white p-3 w-full rounded" :class="yearFilter === 2022 ? 'bg-primary' : 'bg-quinary'"  >
        2022
      </button>
      <button @click="changeYearFilter(2023)" class="text-white p-3 w-full rounded" :class="yearFilter === 2023 ? 'bg-primary' : 'bg-quinary'"  >
        2023
      </button>
      <button @click="changeYearFilter(2024)" class="text-white p-3 w-full rounded" :class="yearFilter === 2024 ? 'bg-primary' : 'bg-quinary'"  >
        2024
      </button>
    </div>
    <div class="flex gap-2">
      <button class="w-fit rounded px-3 py-1 text-xs uppercase lg:text-nowrap hover:bg-zinc-500" :class="onlyMv ? 'bg-primary' : 'bg-quinary'" @click="onlyMv = !onlyMv" >
        Only M/V
      </button>
      <input
        id="search-input"
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60dvh] scrollBarLight pr-2 overflow-x-hidden overflow-y-auto">
      <div v-for="song in searchMusics" :key="song.videoId" class="flex gap-2">
        <div class="flex justify-center items-center px-3 bg-quaternary rounded hover:bg-quinary">
          <IconPlus class="w-5 h-5" />
        </div>
        <MusicDisplay
          :artistId="song?.artists[0]?.id || ''"
          :artistName="song?.artists[0]?.name || ''"
          :musicId="song.videoId || ''"
          :musicName="song.name || ''"
          :musicImage="song.thumbnails[2].url || ''"
          :duration="song?.duration?.toString() || '0'"
          :hasMv="song.hasMv"
          horizontalMode
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

const { $firestore: database } = useNuxtApp()
const { snapshotResultToArray } = useFirebaseFunction()

const yearFilter = ref(2024)
const musics = ref<any[]>([])
const search = ref('')
const onlyMv = ref(false)
const getAllMusics = async () => {
  const colRef = collection(database as any, 'musics');
  const snapshot = await getDocs(query(
    colRef,
    where('year', '==', yearFilter.value)
  ));
  return snapshotResultToArray(snapshot);
}

const changeYearFilter = async (year: number) => {
  yearFilter.value = year
  musics.value = []
  musics.value = await getAllMusics() as any[]
}

const searchMusics = computed(() => {
  return musics.value.filter((music) => {
    const matchesSearch = music.name.toLowerCase().includes(search.value.toLowerCase()) || 
      music.artists[0]?.name.toLowerCase().includes(search.value.toLowerCase())
    
    if (onlyMv.value) {
      return matchesSearch && music.hasMv
    }

    return matchesSearch
  })
})

onMounted(async () => {
  musics.value = await getAllMusics() as any[]
})
</script>