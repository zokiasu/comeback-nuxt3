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
const newsFetch = ref(null)

const search = ref('')
const sort = ref('date')
const invertSort = ref(true)

const startAt = ref(0)
const endAt = ref(9)
const page = ref(1)

onMounted(async () => {
  newsFetch.value = await fetchAllNews()
})

const deleteNews = async (id) => {
  const news = newsFetch.value.find((news) => news.id === id)
  if (news) {
    const index = newsFetch.value.indexOf(news)
    await deleteNewsById(id).then(async () => {
      console.log('Document successfully deleted!')
      newsFetch.value.splice(index, 1)
      toast.success('News deleted', toastOption)
    }).catch((error) => {
      console.error('Error removing document: ', error)
      toast.error('Error Removing News', toastOption)
    })
  } else {
    toast.error('News Not Found', toastOption)
  }
}

const filteredNewsList = computed(() => {
  if (page != 1) page.value = 1
  if (!newsFetch.value) return newsFetch.value
  if (!search.value) {
    return newsFetch.value.sort((a, b) => {
      if (sort.value === 'createdAt') {
        if (!invertSort.value) return a.createdAt - b.createdAt
        return b.createdAt - a.createdAt
      }
      if (sort.value === 'date') {
        const aDate = new Date(a.date.seconds * 1000)
        const bDate = new Date(b.date.seconds * 1000)
        if (!invertSort.value) return aDate - bDate
        return bDate - aDate
      }
      if (sort.value === 'user') {
        if (!invertSort.value) return a.user.id.localeCompare(b.user.id)
        return b.user.id.localeCompare(a.user.id)
      }
      if (sort.value === 'artist') {
        if (!invertSort.value) return a.artist.id.localeCompare(b.artist.id)
        return b.artist.id.localeCompare(a.artist.id)
      }
    })
  } else {
    return newsFetch.value.sort((a, b) => {
      if (sort.value === 'createdAt') {
        if (!invertSort.value) return a.createdAt - b.createdAt
        return b.createdAt - a.createdAt
      }
      if (sort.value === 'date') {
        const aDate = new Date(a.date.seconds * 1000)
        const bDate = new Date(b.date.seconds * 1000)
        if (!invertSort.value) return aDate - bDate
        return bDate - aDate
      }
      if (sort.value === 'user') {
        if (!invertSort.value) return a.user.id.localeCompare(b.user.id)
        return b.user.id.localeCompare(a.user.id)
      }
      if (sort.value === 'artist') {
        if (!invertSort.value) return a.artist.id.localeCompare(b.artist.id)
        return b.artist.id.localeCompare(a.artist.id)
      }
    }).filter((news) => {
      return news.user.name.toLowerCase().includes(search.value.toLowerCase())
        || news.artist.name.toLowerCase().includes(search.value.toLowerCase())
    })
  }
})

// nombre de page pour afficher 9 artist parmis le nombre d'artist total
const nbPage = computed(() => {
  return Math.ceil(filteredNewsList.value.length / 9)
})

watch([page], () => {
  if (page.value > nbPage.value) page.value = nbPage.value
  if (page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * 9
  endAt.value = page.value * 9
})
</script>

<template>
  <div v-if="newsFetch" class="space-y-2">
    <section id="searchbar" class="flex w-full justify-start">
      <input id="search-input" v-model="search" type="text" placeholder="Search"
        class="w-full rounded border-none bg-quinary py-2 px-5 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none" />
    </section>
    <section class="flex w-full justify-between">
      <div class="flex space-x-2">
        <select v-model="sort"
          class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none">
          <option value="date">Date</option>
          <option value="user">User</option>
          <option value="artist">Artist</option>
          <option value="createdAt">Last Created</option>
        </select>
        <button @click="invertSort = !invertSort"
          class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none">
          <icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
          <icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="page = 1" :disabled="startAt == 0"
          class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">First</button>
        <button @click="page--" :disabled="startAt == 0"
          class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Prev</button>
        <input type="text"
          class="w-10 text-center rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
          v-model.number="page" />
        <button @click="page++" :disabled="startAt == nbPage"
          class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Next</button>
        <button @click="page = nbPage" :disabled="startAt == nbPage"
          class="bg-quinary h-full uppercase text-xs px-2 py-1 rounded hover:bg-zinc-500">Last</button>
      </div>
    </section>
    <transition-group 
      v-if="filteredNewsList.length > 0" 
      id="news-list" 
      name="list-complete" 
      tag="div" 
      class="transition-all ease-in-out duration-300 grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <LazyCardDashboardNews
        v-for="news in filteredNewsList.slice(startAt, endAt)" 
        :key="news.taskId"
        :id="news.taskId"
        :message="news.message"
        :artist="news.artist"
        :date="news.date"
        :user="news.user"
        :verified="news.verified"
        @deleteNews="deleteNews"
      />
    </transition-group>
  </div>
</template>