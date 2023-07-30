<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();
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
const artistFetch = ref(null)

onMounted(async () => {
  artistFetch.value = await queryByCollection('artists')
})

const deleteArtist = async (id) => {
  const artist = artistFetch.value.find((artist) => artist.id === id)
  if (artist) {
    const index = artistFetch.value.indexOf(artist)
    await deletebyDoc('artists', id).then(() => {
      console.log('Document successfully deleted!')
      artistFetch.value.splice(index, 1)
      toast.success('Artist Deleted', toastOption)
    }).catch((error) => {
      console.error('Error removing document: ', error)
      toast.error('Error Removing Artist', toastOption)
    })
  } else {
    toast.error('Release Not Found', {
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
    })
  }
}

const search = ref('')
const sort = ref('createdAt')
const invertSort = ref(true)

const startAt = ref(0)
const endAt = ref(9)
const page = ref(1)

const filteredArtistList = computed(() => {
  if (page != 1) page.value = 1
  if (!artistFetch.value) return artistFetch.value
  if (!search.value) {
    return artistFetch.value.sort((a, b) => {
      if (sort.value === 'createdAt') {
        if (!invertSort.value) return a.createdAt - b.createdAt
        return b.createdAt - a.createdAt
      }
      if (sort.value === 'type') {
        if (!invertSort.value) return a.type.localeCompare(b.type)
        return b.type.localeCompare(a.type)
      }
      if (sort.value === 'name') {
        if (!invertSort.value) return a.name.localeCompare(b.name)
        return b.name.localeCompare(a.name)
      }
    })
  } else {
    return artistFetch.value.sort((a, b) => {
      if (sort.value === 'createdAt') {
        if (!invertSort.value) return a.createdAt - b.createdAt
        return b.createdAt - a.createdAt
      }
      if (sort.value === 'type') {
        if (!invertSort.value) return a.type.localeCompare(b.type)
        return b.type.localeCompare(a.type)
      }
      if (sort.value === 'name') {
        if (!invertSort.value) return a.name.localeCompare(b.name)
        return b.name.localeCompare(a.name)
      }
    }).filter((artist) => {
      return artist.name.toLowerCase().includes(search.value.toLowerCase())
    })
  }
})

const nbPage = computed(() => {
  return Math.ceil(filteredArtistList.value.length / 9)
})

watch([page], () => {
  if(page.value > nbPage.value) page.value = nbPage.value
  if(page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * 9
  endAt.value = page.value * 9
})
</script>

<template>
  <div v-if="artistFetch" class="space-y-2">
    <section id="searchbar" class="flex w-full justify-start">
      <input id="search-input" v-model="search" type="text" placeholder="Search" class="w-full rounded border-none bg-quinary py-2 px-5 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none" />
    </section>
    <section class="flex flex-col gap-1.5 sm:flex-row sm:justify-between w-full">

      <div class="flex space-x-2">
        <select v-model="sort" class="rounded border-none text-xs uppercase bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none">
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="createdAt">Last Created</option>
        </select>
        <button @click="invertSort = !invertSort" class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none">
          <icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
          <icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
        </button>
      </div>

      <div class="flex items-center space-x-2 w-full justify-between sm:justify-end">
        <button @click="page = 1" :disabled="startAt == 0" class="bg-quinary aspect-square sm:aspect-auto h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">First</button>
        <button @click="page--" :disabled="startAt == 0" class="bg-quinary aspect-square sm:aspect-auto h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Prev</button>
        <input 
          type="text"
          class="w-10 text-center rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
          v-model.number="page"
        />
        <button @click="page++" :disabled="page == nbPage" class="bg-quinary aspect-square sm:aspect-auto h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Next</button>
        <button @click="page = nbPage" :disabled="page == nbPage" class="bg-quinary aspect-square sm:aspect-auto h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Last</button>
      </div>
    </section>
    <transition-group 
      v-if="filteredArtistList.length > 0" 
      id="artist-list" 
      name="list-complete" 
      tag="div"
      class="transition-all ease-in-out duration-300 grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      <LazyCardDashboardArtist
        v-for="artist in filteredArtistList.slice(startAt, endAt)"
        :key="artist.id"
        :id="artist.id"
        :image="artist.image"
        :name="artist.name"
        :description="artist.description"
        :type="artist.type"
        :idYoutubeMusic="artist.idYoutubeMusic"
        :styles="artist.styles"
        :socials="artist.socials"
        :platforms="artist.platforms"
        :createdAt="artist.createdAt"
        @deleteArtist="deleteArtist"
      />
    </transition-group>
    <p v-else class="uppercase font-semibold bg-quaternary w-full p-5 text-center">
      No artist found
    </p>
  </div>
</template>