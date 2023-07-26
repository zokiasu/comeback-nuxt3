<script setup>
const artistFetch = ref(null)

onMounted(async () => {
  artistFetch.value = await fetchArtists()
})

const search = ref('')

const startAt = ref(0)
const endAt = ref(40)
const page = ref(1)

const filteredArtistList = computed(() => {
  if (page != 1) page.value = 1
  if (!artistFetch.value) return artistFetch.value
  if (!search.value) {
    return artistFetch.value.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  } else {
    return artistFetch.value.sort((a, b) => {
      return a.name.localeCompare(b.name)
    }).filter((artist) => {
      return artist.name.toLowerCase().includes(search.value.toLowerCase())
    })
  }
})

// nombre de page pour afficher 40 artist parmis le nombre d'artist total
const nbPage = computed(() => {
  return Math.ceil(filteredArtistList.value.length / 40)
})

watch([page], () => {
  if (page.value > nbPage.value) page.value = nbPage.value
  if (page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * 40
  endAt.value = page.value * 40
})

useHead({
  title: 'Artist List',
  meta: [{
    name: 'description',
    content: 'Artist List'
  }]
})
</script>

<template>
  <div v-if="artistFetch" class="container mx-auto min-h-screen p-5 space-y-5">
    <section id="searchbar" class="flex flex-col lg:flex-row gap-2 w-full justify-center">
      <input id="search-input" v-model="search" type="text" placeholder="Search" 
      class="w-full rounded border-none bg-quinary py-2 px-5 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none" />
      
      <div class="flex w-full lg:w-fit justify-center items-center space-x-2">
        <button 
          @click="page = 1" :disabled="startAt == 0" 
          class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500"
        >
          First
        </button>
        <button @click="page--" :disabled="startAt == 0" class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Prev</button>
        <div class="flex flex-row w-14 rounded border-none bg-quinary p-2 drop-shadow-xl transition-all duration-700 ease-in-out">
          <input 
            type="text"
            class="w-5 text-center bg-quinary focus:bg-tertiary focus:text-quinary focus:outline-none"
            v-model.number="page" 
          />/ {{ nbPage }}
        </div>
        <button @click="page++" class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Next</button>
        <button @click="page = nbPage" :disabled="startAt == nbPage" class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Last</button>
      </div>
    </section>
    <transition-group v-if="filteredArtistList.length > 0" id="artist-list" name="list" tag="div"
      class="transition-all ease-in-out duration-300 grid grid-cols-2 items-center justify-center gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
      <LazyCardArtist v-for="artist in filteredArtistList.slice(startAt, endAt)" :key="artist.id" :id="artist.id" :image="artist.image"
        :name="artist.name" :type="artist.type" :artistsId="artist.artistsId" :artistsName="artist.artistsName"
        :displayDate="true" class="list-move" />
    </transition-group>
    <p v-else class="uppercase font-semibold bg-quaternary w-full p-5 text-center">
      No artist found
    </p>
      
    <div class="flex text-xs w-full justify-center items-center space-x-2">
      <button 
        @click="page = 1" :disabled="startAt == 0" 
        class="bg-quinary h-full uppercase px-2 py-1 rounded hover:bg-zinc-500"
      >
        First
      </button>
      <button @click="page--" :disabled="startAt == 0" class="bg-quinary h-full uppercase px-2 py-1 rounded hover:bg-zinc-500">Prev</button>
      <div class="flex flex-row w-14 h-full rounded border-none bg-quinary p-2 drop-shadow-xl transition-all duration-700 ease-in-out">
        <input 
          type="text"
          class="h-full w-5 text-center bg-quinary focus:bg-tertiary focus:text-quinary focus:outline-none"
          v-model.number="page" 
        />/ {{ nbPage }}
      </div>
      <button @click="page++" class="bg-quinary h-full uppercase px-2 py-1 rounded hover:bg-zinc-500">Next</button>
      <button @click="page = nbPage" :disabled="startAt == nbPage" class="bg-quinary h-full uppercase px-2 py-1 rounded hover:bg-zinc-500">Last</button>
    </div>
  </div>
</template>

<style scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active {
  transition: all 1.5s ease;
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