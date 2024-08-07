<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()
const newsFetch = ref([])

const search = ref('')
const sort = ref('date')
const invertSort = ref(true)

const startAt = ref(0)
const endAt = ref(12)
const page = ref(1)

onMounted(async () => {
  newsFetch.value = await queryByCollection('news')
})

const deleteNews = async (id) => {
  const newsToDelete = newsFetch.value.find((news) => news.taskId === id)

  if (newsToDelete) {
    const index = newsFetch.value.indexOf(newsToDelete)
    await deletebyDoc('news', id)
      .then(async () => {
        newsFetch.value.splice(index, 1)
        toast.success('News deleted')
      })
      .catch((error) => {
        console.error('Error removing document: ', error)
        toast.error('Error Removing News')
      })
  } else {
    toast.error('News Not Found')
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
        const aDate = new Date(a?.date?.seconds * 1000)
        const bDate = new Date(b?.date?.seconds * 1000)
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
    return newsFetch.value
      .sort((a, b) => {
        if (sort.value === 'createdAt') {
          if (!invertSort.value) return a.createdAt - b.createdAt
          return b.createdAt - a.createdAt
        }
        if (sort.value === 'date') {
          const aDate = new Date(a?.date?.seconds * 1000)
          const bDate = new Date(b?.date?.seconds * 1000)
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
      .filter((news) => {
        return (
          news.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
          news.artist.name.toLowerCase().includes(search.value.toLowerCase())
        )
      })
  }
})

const nbPage = computed(() => {
  return Math.ceil(filteredNewsList.value.length / 12)
})

watch([page], () => {
  if (page.value > nbPage.value) page.value = nbPage.value
  if (page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * 12
  endAt.value = page.value * 12
})
</script>

<template>
  <div ref="scrollContainer" class="relative h-full pr-2 space-y-3 overflow-hidden overflow-y-scroll scrollBarLight">
    <section id="searchbar" class="sticky top-0 z-50 w-full pb-2 space-y-2 bg-secondary">
      <input
        id="search-input"
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
      <section class="flex flex-col w-full gap-2 sm:flex-row sm:justify-between">
        <div class="flex space-x-2">
          <select
            v-model="sort"
            class="w-full p-2 text-xs uppercase transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
          >
            <option value="date">Date</option>
            <option value="user">User</option>
            <option value="artist">Artist</option>
            <option value="createdAt">Last Created</option>
          </select>
          <button
            @click="invertSort = !invertSort"
            class="p-2 transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl hover:bg-tertiary hover:text-quinary focus:outline-none"
          >
            <icon-sort v-if="!invertSort" class="w-6 h-6 text-tertiary" />
            <icon-sort-reverse v-else class="w-6 h-6 text-tertiary" />
          </button>
        </div>

        <div class="flex justify-between w-full space-x-2 sm:justify-end">
          <button
            @click="page = 1"
            :disabled="startAt == 0"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            First
          </button>
          <button
            @click="page--"
            :disabled="startAt == 0"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            Prev
          </button>
          <input
            type="text"
            class="w-10 p-2 text-center transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl hover:bg-tertiary hover:text-quinary focus:outline-none"
            v-model.number="page"
          />
          <button
            @click="page++"
            :disabled="page == nbPage"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            Next
          </button>
          <button
            @click="page = nbPage"
            :disabled="page == nbPage"
            class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
          >
            Last
          </button>
        </div>
      </section>
    </section>
    <transition-group
      v-if="filteredNewsList.length > 0"
      id="news-list"
      name="list-complete"
      tag="div"
      class="grid items-center justify-center grid-cols-1 gap-5 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <LazyCardDashboardNews
        v-for="news in filteredNewsList.slice(startAt, endAt)"
        :key="news.taskId"
        :id="news.taskId"
        :message="news.message"
        :artist="news.artist"
        :artists="news.artists"
        :date="news.date"
        :user="news.user"
        :verified="news.verified"
        @deleteNews="deleteNews(news.taskId)"
      />
    </transition-group>
  </div>
</template>
