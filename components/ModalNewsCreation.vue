<script setup>
import VueMultiselect from 'vue-multiselect'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/user'
import debounce from 'lodash.debounce';

const { userDataStore } = useUserStore()
const { getComebackExist } = useFirebaseFunction()
const toast = useToast()
const { result, search } = useAlgoliaSearch('Artists');

const emit = defineEmits(['closeModal'])

const dateToDateFormat = ref(null)
const sendNews = ref(false)
const searchArtist = ref('')
const artistListSearched = ref([])

const news = ref({
  artists: [],
  user: {
    id: userDataStore.id,
    name: userDataStore.name,
    picture: userDataStore.picture,
  },
  date: null,
  message: null,
  verified: false,
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
})

// Définition d'une fonction de recherche débattue
const debouncedSearch = debounce(async (query) => {
  await useAsyncData('ssr-search-results', () => search({ query }));
  
  if(!result.value) return;
  artistListSearched.value = result.value.hits.slice(0, 10);
}, 500); // Attend 500ms après le dernier appel avant d'exécuter la fonction

watchEffect(() => {
  if (searchArtist.value.length > 2) {
    debouncedSearch(searchArtist.value);
  }
});

watch([dateToDateFormat], () => {
  if(!dateToDateFormat.value) return
  const tmpDate = new Date(dateToDateFormat.value)
  tmpDate.setHours(0, 0, 0, 0)
  news.value.date = Timestamp.fromDate(tmpDate)
  news.value.message = `Next comeback on ${new Date(
    dateToDateFormat.value,
  ).toLocaleDateString()}`
})

const closeModal = () => {
  emit('closeModal')
}

const createNews = async () => {
  // if (await getComebackExist(news.value.date, news.value.artist.name)) {
  //   toast.error('Comeback already exist')
  //   closeModal()
  //   return
  // }

  sendNews.value = true
  
  add('news', news.value)
    .then(() => {
      news.value = {
        artists: [],
        user: {
          id: userDataStore.id,
          name: userDataStore.name,
          image: userDataStore.picture,
        },
        date: null,
        message: null,
        verified: false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      }
      dateToDateFormat.value = null
      toast.success('News created')
      sendNews.value = false
      closeModal()
    })
    .catch((error) => {
      sendNews.value = false
      console.error('Error adding document: ', error)
      toast.error('Error creating news')
    })
}

const addArtistToNews = (artist) => {
  news.value.artists.push({
    id: artist.id,
    name: artist.name,
    picture: artist.image,
  })
  searchArtist.value = ''
  artistListSearched.value = []
}

const clearSearch = () => {
  searchArtist.value = ''
  artistListSearched.value = []
}
</script>

<template>
  <div class="py-2 space-y-5">
    <div class="relative">
      <ComebackInput label="Select artist(s)" placeholder="Search Artist" v-model="searchArtist" @clear="clearSearch" />
      <div 
        v-if="artistListSearched.length" 
        class="absolute z-10 flex flex-col justify-start w-full h-40 p-1 overflow-hidden overflow-y-auto scrollBarLight oversc top-18 bg-quaternary"
      >
        <button 
          @click="addArtistToNews(artist)" 
          v-for="artist in artistListSearched" 
          :key="artist.id" 
          class="p-2 rounded hover:bg-quinary text-start"
        >
          {{ artist.name }}
        </button>
      </div>
    </div>
    <div v-if="news.artists.length" class="flex flex-col gap-1">
      <ComebackLabel label="Artist(s)" />
      <div class="flex flex-wrap gap-5">
        <div v-for="artist in news.artists" :key="artist.id" class="flex items-center gap-3">
          <img :src="artist.picture" class="object-cover w-8 h-8 rounded-full" />
          <p>{{ artist.name }}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <ComebackLabel label="Date" />
      <VueDatePicker v-model="dateToDateFormat" placeholder="Select Date" auto-apply :enable-time-picker="false" dark />
    </div>
    <div class="flex flex-col gap-1">
      <ComebackInput label="Your News" placeholder="Your News" v-model="news.message" @clear="news.message = ''" />
    </div>
    <button
      @click="createNews"
      :disabled="sendNews"
      class="w-full py-2 font-semibold uppercase transition-all duration-300 ease-in-out rounded bg-primary hover:scale-105 hover:bg-red-900"
    >
      <p v-if="sendNews">Sending...</p>
      <p v-else>Send News</p>
    </button>
  </div>
</template>
