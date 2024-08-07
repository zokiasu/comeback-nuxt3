<script setup>
import VueMultiselect from 'vue-multiselect'
import VueDatePicker from '@vuepic/vue-datepicker'
// import '@vuepic/vue-datepicker/dist/main.css'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/user'
const { userDataStore } = useUserStore()

const toast = useToast()

const { artistList } = defineProps({
  artistList: {
    type: Array,
    required: true,
  },
})

const dateToDateFormat = ref(null)
const artistToSend = ref(null)
const sendNews = ref(false)

const news = ref({
  artist: {
    id: null,
    name: null,
    image: null,
  },
  user: {
    id: userDataStore.id,
    name: userDataStore.name,
    picture: userDataStore.picture,
  },
  date: null,
  message: null,
  verified: false,
  date: null,
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
})

watch([dateToDateFormat], () => {
  const tmpDate = new Date(dateToDateFormat.value)
  tmpDate.setHours(0, 0, 0, 0)
  news.value.date = Timestamp.fromDate(tmpDate)
  news.value.message = `Next comeback on ${new Date(
    dateToDateFormat.value,
  ).toLocaleDateString()}`
})

watch([artistToSend], () => {
  news.value.artist.id = artistToSend.value.id
  news.value.artist.name = artistToSend.value.name
  news.value.artist.image = artistToSend.value.image
})

const emit = defineEmits(['closeModal'])
const closeModal = () => {
  emit('closeModal')
}

const { getComebackExist } = useFirebaseFunction()

const createNews = async () => {
  if (await getComebackExist(news.value.date, news.value.artist.name)) {
    toast.error('Comeback already exist')
    closeModal()
    return
  }

  sendNews.value = true
  add('news', news.value)
    .then(() => {
      news.value = {
        artist: null,
        user: {
          id: userDataStore.id,
          name: userDataStore.name,
          image: userDataStore.picture,
        },
        date: null,
        message: null,
        verified: false,
        date: null,
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
</script>

<template>
  <div class="py-2 space-y-5">
    <div class="flex flex-col gap-1">
      <ComebackLabel label="Artist" />
      <VueMultiselect
        v-model="artistToSend"
        label="name"
        track-by="name"
        :options="artistList"
        placeholder="Search or add a group"
        :multiple="false"
        :close-on-select="true"
        :clear-on-select="false"
        :preserve-search="false"
      />
    </div>
    <div class="flex flex-col gap-1">
      <ComebackLabel label="Date" />
      <VueDatePicker v-model="dateToDateFormat" auto-apply :enable-time-picker="false" />
    </div>
    <div class="flex flex-col gap-1">
      <ComebackInput label="Your News" placeholder="Your News" v-model="news.message" />
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
