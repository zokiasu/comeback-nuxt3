<template>
  <div class="flex flex-col space-y-5 min-h-dvh-wo-nav lg:max-h-dvh-wo-nav p-5">
    <div class="flex gap-2 justify-between items-end">
      <ComebackInput label="Ranking Name" placeholder="Enter a ranking name" v-model="rankingName" class="w-full"/>
      <button @click="createRanking" class="bg-primary hover:bg-primary/80 text-white px-3 py-2 lg:py-1.5 rounded whitespace-nowrap text-sm lg:text-base">
        Create Ranking
      </button>
    </div>
    <div class="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4 lg:flex-1">
      <!-- Search -->
      <div class="h-full mx-auto space-y-3 rounded border w-full border-quaternary p-2 lg:p-5">
        <!-- Year Filter -->
        <div class="flex flex-wrap lg:flex-nowrap gap-2 text-sm lg:text-xl">
          <button @click="changeYearFilter(2020)" class="text-white p-3 w-fit lg:w-full rounded" :class="yearFilter === 2020 ? 'bg-primary' : 'bg-quinary'"  >
            2020
          </button>
          <button @click="changeYearFilter(2021)" class="text-white p-3 w-fit lg:w-full rounded" :class="yearFilter === 2021 ? 'bg-primary' : 'bg-quinary'"  >
            2021
          </button>
          <button @click="changeYearFilter(2022)" class="text-white p-3 w-fit lg:w-full rounded" :class="yearFilter === 2022 ? 'bg-primary' : 'bg-quinary'"  >
            2022
          </button>
          <button @click="changeYearFilter(2023)" class="text-white p-3 w-fit lg:w-full rounded" :class="yearFilter === 2023 ? 'bg-primary' : 'bg-quinary'"  >
            2023
          </button>
          <button @click="changeYearFilter(2024)" class="text-white p-3 w-fit lg:w-full rounded" :class="yearFilter === 2024 ? 'bg-primary' : 'bg-quinary'"  >
            2024
          </button>
        </div>
        <!-- Only M/V & Search -->
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
        <!-- Sort -->
         <div class="flex items-center justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-xs uppercase">Sort by :</p>
            <div class="flex flex-wrap gap-2">
              <button class="w-fit rounded px-3 py-1 text-xs uppercase lg:text-nowrap hover:bg-zinc-500" :class="sorting === 'name' ? 'bg-primary' : 'bg-quinary'" @click="sorting = 'name'" >
                Name
              </button>
              <button class="w-fit rounded px-3 py-1 text-xs uppercase lg:text-nowrap hover:bg-zinc-500" :class="sorting === 'artist' ? 'bg-primary' : 'bg-quinary'" @click="sorting = 'artist'" >
                Artist Name
              </button>
              <button class="w-fit rounded px-3 py-1 text-xs uppercase lg:text-nowrap hover:bg-zinc-500" :class="sorting === 'date' ? 'bg-primary' : 'bg-quinary'" @click="sorting = 'date'" >
                Release Date
              </button>
            </div>
          </div>
          
          <button
              @click="invertSort = !invertSort"
              class="rounded border-none bg-quinary p-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
            >
              <icon-sort v-if="!invertSort" class="h-4 w-4 text-tertiary" />
              <icon-sort-reverse v-else class="h-4 w-4 text-tertiary" />
            </button>
        </div>
        <!-- Musics -->
        <div v-if="searchMusics.length > 0" class="grid grid-cols-1 gap-4 max-h-[35dvh] lg:max-h-[65dvh] scrollBarLight pr-2 overflow-x-hidden overflow-y-auto">
          <div v-for="song in searchMusics" :key="song.videoId" class="flex gap-2">
            <button
              @click="addMusicToRanking(song)" 
              class="flex justify-center items-center px-3 bg-quaternary rounded hover:bg-quinary" 
              :class="checkIsInRanking(song) ? 'opacity-30 cursor-not-allowed' : ''"
            >
              <IconPlus class="w-5 h-5" />
            </button>
            <MusicDisplay
              :artistId="song?.artists[0]?.id || ''"
              :artistName="song?.artists[0]?.name || ''"
              :musicId="song.videoId || ''"
              :musicName="song.name || ''"
              :musicDate="song.date"
              :musicImage="song.thumbnails[2].url || ''"
              :duration="song?.duration?.toString() || '0'"
              :hasMv="song.hasMv"
              horizontalMode
            />
          </div>
        </div>
        <div v-else class="grid grid-cols-1 gap-4 max-h-[35dvh] lg:max-h-[65dvh] scrollBarLight pr-2 overflow-x-hidden overflow-y-auto">
            <p class="text-center text-tertiary/50 font-semibold">Loading data...</p>
        </div>
        <p v-if="searchMusics.length > 0" class="text-xs italic text-right">
          {{ searchMusics.length }} results
        </p>
      </div>
      <!-- Ranking -->
      <div class="h-full mx-auto space-y-3 w-full border border-quaternary rounded p-2 lg:p-5">
        <p class="text-xl xl:text-2xl text-center font-bold">Ranking</p>
        <div class="space-y-2 max-h-[75dvh] scrollBarLight pr-2 overflow-y-auto">
          <draggable 
            v-model="rankingMusics"
            class="space-y-2"
            ghost-class="bg-tertiary/50"
            :animation="200"
            item-key="videoId"
            handle=".handle"
          >
            <template #item="{element, index}">
              <div class="flex gap-2 handle cursor-move">
                <div class="flex items-center justify-center px-3 bg-quaternary rounded lg:min-w-[55px] text-xs lg:text-base">
                  <span class="font-bold">#{{ index + 1 }}</span>
                </div>
                <MusicDisplay
                  :artistId="element?.artists[0]?.id || ''"
                  :artistName="element?.artists[0]?.name || ''"
                  :musicId="element.videoId || ''"
                  :musicName="element.name || ''"
                  :musicImage="element.thumbnails[2].url || ''"
                  :musicDate="element.date"
                  :duration="element?.duration?.toString() || '0'"
                  :hasMv="element.hasMv"
                  horizontalMode
                />
                <button @click.stop="rankingMusics = rankingMusics.filter(m => m.videoId !== element.videoId)" class="flex justify-center items-center px-3 bg-quaternary rounded hover:bg-quinary">
                  <IconClose class="w-5 h-5" />
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import draggable from 'vuedraggable'
  import { useFirebaseRealtimeDatabase } from "~/composables/useFirebaseRealtimeDatabase";
  import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
  import { useToast } from 'vue-toastification'
  import { useUserStore } from '@/stores/user'

  const toast = useToast()
  const router = useRouter()
  const { userDataStore, isLoginStore } = useUserStore()
  const { $firestore: database } = useNuxtApp()
  const { snapshotResultToArray } = useFirebaseFunction()
  const { writeDataWithRandomId } = useFirebaseRealtimeDatabase();

  const yearFilter = ref(2024)
  const musics = ref<any[]>([])
  const search = ref('')
  const onlyMv = ref(false)
  const rankingName = ref('')
  const rankingMusics = ref<any[]>([])
  const sorting = ref('date')
  const invertSort = ref(true)

  const addMusicToRanking = (music: any) => {
    if (!rankingMusics.value.includes(music)) {
      rankingMusics.value.push(music)
      toast.success('Music added to ranking')
    } else {
      toast.error('Music already in ranking')
    }
  }

  const getAllMusics = async () => {
    const colRef = collection(database as any, 'musics');
    const startDate = new Date(`${yearFilter.value}-01-01`);
    const endDate = new Date(`${yearFilter.value}-12-31`);
    
    const snapshot = await getDocs(query(
      colRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    ));
    return snapshotResultToArray(snapshot);
  }

  const changeYearFilter = async (year: number) => {
    yearFilter.value = year
    musics.value = []
    musics.value = await getAllMusics() as any[]
  }

  const createRanking = async () => {
    if (!userDataStore?.id || !isLoginStore) return

    if (!rankingName.value) return toast.error('Ranking name is required')

    if (rankingMusics.value.length < 3) return toast.error('Ranking must have at least 3 musics')

    const path = `/rankings/${userDataStore.id}`
    
    try {
      await writeDataWithRandomId(path, {
        name: rankingName.value,
        musics: rankingMusics.value
      })
      toast.success('Ranking created')
      router.push(`/profile/${userDataStore?.id}`)
    } catch (error) {
      console.error('Error updating ranking:', error)
      toast.error('Error updating ranking')
    }
  }

  const checkIsInRanking = (music: any) => {
    return rankingMusics.value.some(m => m.videoId === music.videoId)
  }

  const searchMusics = computed(() => {
    return musics.value.filter((music) => {

      const matchesSearch = music.name.toLowerCase().includes(search.value.toLowerCase()) || 
        music.artists[0]?.name.toLowerCase().includes(search.value.toLowerCase())
      
      if (onlyMv.value) {
        return matchesSearch && music.hasMv
      }

      return matchesSearch
    }).sort((a, b) => {
      // Sort by name
      if (sorting.value === 'name') {
        if (!invertSort.value) {
          return a.name.localeCompare(b.name)
        }
        return b.name.localeCompare(a.name)
      }
      // Sort by artist name 
      if (sorting.value === 'artist') {
        if (!invertSort.value) {
          return a.artists[0]?.name.localeCompare(b.artists[0]?.name)
        }
        return b.artists[0]?.name.localeCompare(a.artists[0]?.name)
      }
      // Sort by date
      if (sorting.value === 'date') {
        const dateA = a.date.toDate().getTime()
        const dateB = b.date.toDate().getTime()
        if (!invertSort.value) {
          return dateA - dateB
        }
        return dateB - dateA
      }
      return 0
    })
  })

  onMounted(async () => {
    musics.value = await getAllMusics() as any[]

    if(!isLoginStore) {
      toast.info('You must be logged in to create a ranking')
    }
  })
</script>