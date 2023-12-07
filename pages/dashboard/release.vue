<script setup>
import { collection, onSnapshot } from 'firebase/firestore'
import { useToast } from 'vue-toastification'

const { $firestore: db } = useNuxtApp()
const toast = useToast()
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

const releaseFetch = ref(null)

const search = ref('')
const sort = ref('date')
const invertSort = ref(true)

const startAt = ref(0)
const endAt = ref(24)
const page = ref(1)

const needToBeVerifiedFilter = ref(false)

onMounted(async () => {
  // releaseFetch.value = await queryByCollection('releases')

  onSnapshot(collection(db, 'releases'), (querySnapshot) => {
    releaseFetch.value = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
  })
})

const deleteRelease = async (id) => {
  const release = releaseFetch.value.find((release) => release.id === id)
  if (release) {
    const index = releaseFetch.value.indexOf(release)
    await deletebyDoc('releases', id)
      .then(() => {
        console.log('Document successfully deleted!')
        // releaseFetch.value.splice(index, 1)
        toast.success('Release Deleted', toastOption)
      })
      .catch((error) => {
        console.error('Error removing document: ', error)
        toast.error('Error Removing Release', toastOption)
      })
  } else {
    toast.error('Release Not Found', toastOption)
  }
}

const verifiedRelease = async (id) => {
  const release = releaseFetch.value.find((release) => release.id === id)
  if (release) {
    const index = releaseFetch.value.indexOf(release)
    release.needToBeVerified = false
    update('releases', id, release)
      .then(() => {
        console.log('Document successfully updated!')
        releaseFetch.value.splice(index, 1, release)
        toast.success('Release Verified', toastOption)
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
        toast.error('Error Updating Release', toastOption)
      })
  } else {
    toast.error('Release Not Found', toastOption)
  }
}

const filteredReleaseList = computed(() => {
  if (page != 1) page.value = 1
  if (!releaseFetch.value) return releaseFetch.value
  if (!search.value) {
    return releaseFetch.value
      .sort((a, b) => {
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
        if (sort.value === 'type') {
          if (!invertSort.value) return a.type.localeCompare(b.type)
          return b.type.localeCompare(a.type)
        }
        if (sort.value === 'name') {
          if (!invertSort.value) return a.name.localeCompare(b.name)
          return b.name.localeCompare(a.name)
        }
        if (sort.value === 'year') {
          if (!invertSort.value) return a.year - b.year
          return b.year - a.year
        }
        if (sort.value === 'artistsId') {
          if (!invertSort.value) return a.artistsId.localeCompare(b.artistsId)
          return b.artistsId.localeCompare(a.artistsId)
        }
      })
      .filter((artist) => {
        if (needToBeVerifiedFilter.value) return artist.needToBeVerified
        return true
      })
  } else {
    return releaseFetch.value
      .sort((a, b) => {
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
        if (sort.value === 'type') {
          if (!invertSort.value) return a.type.localeCompare(b.type)
          return b.type.localeCompare(a.type)
        }
        if (sort.value === 'name') {
          if (!invertSort.value) return a.name.localeCompare(b.name)
          return b.name.localeCompare(a.name)
        }
        if (sort.value === 'year') {
          if (!invertSort.value) return a.year - b.year
          return b.year - a.year
        }
        if (sort.value === 'artistsId') {
          if (!invertSort.value) return a.artistsId.localeCompare(b.artistsId)
          return b.artistsId.localeCompare(a.artistsId)
        }
      })
      .filter((artist) => {
        if (needToBeVerifiedFilter.value) return artist.needToBeVerified
        return (
          artist.name.toLowerCase().includes(search.value.toLowerCase()) ||
          artist.artistsName.toLowerCase().includes(search.value.toLowerCase())
        )
      })
  }
})

// nombre de page pour afficher 24 artist parmis le nombre d'artist total
const nbPage = computed(() => {
  return Math.ceil(filteredReleaseList.value.length / 24)
})

watch([page], () => {
  if (page.value > nbPage.value) page.value = nbPage.value
  if (page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * 24
  endAt.value = page.value * 24
})
</script>

<template>
  <div v-if="releaseFetch" class="space-y-2">
    <section id="searchbar" class="flex w-full justify-start">
      <input
        id="search-input"
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
    </section>
    <section class="flex w-full flex-col gap-1.5 sm:flex-row sm:justify-between">
      <div class="flex space-x-2">
        <select
          v-model="sort"
          class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
        >
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="date">Date</option>
          <option value="year">Year</option>
          <option value="artistsId">Artist</option>
          <option value="createdAt">Last Created</option>
        </select>
        <button
          @click="invertSort = !invertSort"
          class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
        >
          <icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
          <icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
        </button>
        <button
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
          :class="needToBeVerifiedFilter ? 'bg-primary' : 'bg-quinary'"
          @click="needToBeVerifiedFilter = !needToBeVerifiedFilter"
        >
          Only NTBV
        </button>
      </div>

      <div class="flex w-full justify-between space-x-2 sm:justify-end">
        <button
          @click="page = 1"
          :disabled="startAt == 0"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          First
        </button>
        <button
          @click="page--"
          :disabled="startAt == 0"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Prev
        </button>
        <input
          type="text"
          class="w-10 rounded border-none bg-quinary p-2 text-center placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
          v-model.number="page"
        />
        <button
          @click="page++"
          :disabled="page == nbPage"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Next
        </button>
        <button
          @click="page = nbPage"
          :disabled="page == nbPage"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Last
        </button>
      </div>
    </section>
    <transition-group
      v-if="filteredReleaseList.length > 0"
      id="release-list"
      name="list-complete"
      tag="div"
      class="grid grid-cols-1 items-center justify-center gap-5 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <LazyCardDashboardRelease
        v-for="release in filteredReleaseList.slice(startAt, endAt)"
        :key="release.id"
        :id="release.id"
        :artistsName="release.artistsName"
        :createdAt="release.createdAt"
        :date="release.date"
        :idYoutubeMusic="release.idYoutubeMusic"
        :image="release.image"
        :name="release.name"
        :needToBeVerified="release.needToBeVerified"
        :platformList="release.platformList"
        :type="release.type"
        :yearReleased="release.year"
        @deleteRelease="deleteRelease"
        @verifiedRelease="verifiedRelease"
      />
    </transition-group>
    <p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
      No Release founded
    </p>
    <section class="flex w-full flex-col gap-1.5 sm:flex-row sm:justify-between">
      <div class="flex space-x-2">
        <select
          v-model="sort"
          class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
        >
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="date">Date</option>
          <option value="year">Year</option>
          <option value="artistsId">Artist</option>
          <option value="createdAt">Last Created</option>
        </select>
        <button
          @click="invertSort = !invertSort"
          class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
        >
          <icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
          <icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
        </button>
        <button
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
          :class="needToBeVerifiedFilter ? 'bg-primary' : 'bg-quinary'"
          @click="needToBeVerifiedFilter = !needToBeVerifiedFilter"
        >
          Only NTBV
        </button>
      </div>

      <div class="flex w-full justify-between space-x-2 sm:justify-end">
        <button
          @click="page = 1"
          :disabled="startAt == 0"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          First
        </button>
        <button
          @click="page--"
          :disabled="startAt == 0"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Prev
        </button>
        <input
          type="text"
          class="w-10 rounded border-none bg-quinary p-2 text-center placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
          v-model.number="page"
        />
        <button
          @click="page++"
          :disabled="page == nbPage"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Next
        </button>
        <button
          @click="page = nbPage"
          :disabled="page == nbPage"
          class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
        >
          Last
        </button>
      </div>
    </section>
  </div>
</template>
