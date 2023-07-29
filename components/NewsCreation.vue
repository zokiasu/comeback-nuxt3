<script setup>
  import VueMultiselect from 'vue-multiselect';
  import { Timestamp } from 'firebase/firestore';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
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

  const { artistList } = defineProps({
    artistList: {
      type: Array,
      required: true,
    },
  })

  const { userData } = useUser();
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
      id: userData.value.id,
      name: userData.value.name,
      picture: userData.value.picture,
    },
    date: null,
    message: null,
    verified: false,
    date: null,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
  })

  watch([dateToDateFormat], () => {
    news.value.date = Timestamp.fromDate(new Date(dateToDateFormat.value))
    news.value.message = `Next comeback on ${new Date(dateToDateFormat.value).toLocaleDateString()}`
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

  const createNews = () => {
    sendNews.value = true
    console.log(news.value)
    add('news', news.value).then(() => {
      news.value = {
        artist: null,
        user: {
          id: userData.value.id,
          name: userData.value.name,
          image: userData.value.picture,
        },
        date: null,
        message: null,
        verified: false,
        date: null,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      }
      dateToDateFormat.value = null
      toast.success('News created', toastOption)
      sendNews.value = false
      closeModal()
    }).catch((error) => {
      sendNews.value = false
      console.error('Error adding document: ', error)
      toast.error('Error creating news', toastOption)
    })
  }
</script>

<template>
  <div class="space-y-5 py-2">
    <div class="flex flex-col gap-1">
      <CbLabel label="Artist" />
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
      <CbLabel label="Date" />
      <VueDatePicker v-model="dateToDateFormat" auto-apply :enable-time-picker="false" />
    </div>
    <div class="flex flex-col gap-1">
      <CbInput label="Your News" placeholder="Your News" :value="news.message" />
    </div>
    <button @click="createNews" class="bg-primary w-full rounded font-semibold uppercase py-2 hover:scale-105 hover:bg-red-900 transition-all ease-in-out duration-300">
      Send News
    </button>
  </div>
</template>