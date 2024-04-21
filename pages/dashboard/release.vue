<script setup>
import { collection, onSnapshot } from 'firebase/firestore'
import { useToast } from 'vue-toastification'


const { $firestore: db } = useNuxtApp()
const toast = useToast()
const { getAllReleases } = useFirebaseFunction()

const releaseFetch = ref(null)

const search = ref('')
const sort = ref('date')
const invertSort = ref(true)

const artistPerPage = ref(24)
const startAt = ref(0)
const endAt = ref(artistPerPage.value)
const page = ref(1)

const needToBeVerifiedFilter = ref(false)

let lastVisible;

const fetchPage = async (pageSize) => {
  let query = collection(db, 'releases').orderBy('date').limit(pageSize);

  if (lastVisible) {
    query = query.startAfter(lastVisible);
  }

  const snapshot = await getDocs(query);

  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return snapshot.docs.map(doc => doc.data());
}

const nextPage = async () => {
  const releases = await fetchPage(9);

  // Appliquez vos filtres ici
  // ...

  return releases;
}

const deleteRelease = async (id) => {
  const release = releaseFetch.value.find((release) => release.id === id)
  if (release) {
    const index = releaseFetch.value.indexOf(release)
    releaseFetch.value.splice(index, 1)
  } else {
    toast.error('Release Not Found')
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
        toast.success('Release Verified')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
        toast.error('Error Updating Release')
      })
  } else {
    toast.error('Release Not Found')
  }
}

onMounted(async () => {
  // onSnapshot(collection(db, 'releases'), (querySnapshot) => {
  //   releaseFetch.value = querySnapshot.docs.map((doc) => {
  //     return {
  //       id: doc.id,
  //       ...doc.data(),
  //     }
  //   })
  //   releaseFetch.value.filter((doc, index, self) => self.findIndex((t) => t.id === doc.id) === index)
  // })
  releaseFetch.value = await getAllReleases()
})

const filteredReleaseList = computed(() => {
  if (page != 1) page.value = 1

  let releases = releaseFetch.value ? [...releaseFetch.value] : [];


  if (!search.value) {
    return releases
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
      .filter((release) => {
        if (needToBeVerifiedFilter.value) return release.needToBeVerified
        return true
      })
  } else {
    return releases
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
      .filter((release) => {
        if (needToBeVerifiedFilter.value) return release.needToBeVerified
        return (
          release.name.toLowerCase().includes(search.value.toLowerCase()) ||
          release.artistsName.toLowerCase().includes(search.value.toLowerCase()) ||
          release.idYoutubeMusic.includes(search.value) ||
          release.id.includes(search.value)
        )
      })
  }
})

// nombre de page pour afficher artistPerPage.value artist parmis le nombre d'artist total
const nbPage = computed(() => {
  if(!filteredReleaseList.value) return 0;
  return Math.ceil(filteredReleaseList.value.length / artistPerPage.value);
})

watch([page], () => {
  if (page.value > nbPage.value) page.value = nbPage.value
  if (page.value < 1) page.value = 1
  startAt.value = (page.value - 1) * artistPerPage.value
  endAt.value = page.value * artistPerPage.value
})
</script>

<template>
  <div ref="scrollContainer" class="relative space-y-3 h-full overflow-y-scroll overflow-hidden scrollBarLight pr-2">
    <section id="searchbar" class="sticky top-0 w-full space-y-2 bg-secondary pb-2 z-50">
      <input
        id="search-input"
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
      <section class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
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
    </section>
    
    <div
      v-if="filteredReleaseList && (filteredReleaseList.length > 0)"
      id="release-list"
      class="grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 2xl:gap-2"
    >
      <div v-for="release in filteredReleaseList.slice(startAt, endAt)" :key="`key_`+release.id" class="w-full h-full">
        <CardDashboardRelease
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
        />
      </div>
    </div>
    <p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
      No Release founded
    </p>
  </div>
</template>
