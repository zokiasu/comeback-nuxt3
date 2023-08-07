<script setup>
import * as fire from 'firebase/storage'
import VueMultiselect from 'vue-multiselect'
import { Timestamp } from 'firebase/firestore';
import { useToast } from "vue-toastification";

definePageMeta({
  middleware: 'admin'
})

const title = ref('Edit Artist Page')
const description = ref('Edit Artist Page')

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
const route = useRoute()

const isUploadingImage = ref(false)

const artist = ref(null)
const groupList = ref(null)
const membersList = ref(null)
const artistList = ref(null)
const stylesList = ref(null)
const artistToEdit = ref({
  id: '',
  idYoutubeMusic: '',
  name: '',
  type: '',
  description: '',
  image: '',
  platforms: [],
  socials: [],
  styles: [],
  groups: [],
  members: []
})

onBeforeMount(async () => {
  artist.value = await fetchArtistBasicInfoById(route.params.id)
  Object.assign(artistToEdit.value, artist.value)

  title.value = 'EDIT ARTIST : ' + artist.value.name
  description.value = artist.value.description

  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter(artist => artist.type == 'GROUP')
  membersList.value = artistList.value.filter(artist => artist.type == 'SOLO')

  stylesList.value = await queryByCollection('general')
  stylesList.value = stylesList.value[0].styles
})

const uploadImageFile = async (files) => {
  // verify if files exist
  if (!files.length) return

  isUploadingImage.value = true
  const file = files[0]
  const storageRef = ref(null)
  const fileRef = ref(null)
  const downloadUrl = ref(null)
  const storage = fire.getStorage()
  const metadata = {
    contentType: file.type,
  }

  storageRef.value = fire.ref(storage, `images/artist/${new Date()}`)

  fire.uploadBytes(storageRef.value, file, metadata)
    .then(async (snapshot) => {
      fileRef.value = snapshot.ref
      downloadUrl.value = await fire.getDownloadURL(fileRef.value)
      artistToEdit.value.image = downloadUrl.value
      isUploadingImage.value = false
      toast.success('Image Upload', toastOption)
    })
    .catch((error) => {
      console.error('error', error)
      isUploadingImage.value = false
      toast.warning('Image Upload Failed', toastOption)
    })
}

const updateArtist = async () => {
  // verify each field from artistToEdit is not equal to artist's field
  if (artistToEdit.value.name == artist.value.name &&
    artistToEdit.value.idYoutubeMusic == artist.value.idYoutubeMusic &&
    artistToEdit.value.type == artist.value.type &&
    artistToEdit.value.description == artist.value.description &&
    artistToEdit.value.image == artist.value.image &&
    artistToEdit.value.platforms == artist.value.platforms &&
    artistToEdit.value.socials == artist.value.socials &&
    artistToEdit.value.styles == artist.value.styles &&
    artistToEdit.value.groups == artist.value.groups &&
    artistToEdit.value.members == artist.value.members
  ) {
    console.log('No changes')
    return
  }

  if (artistToEdit.value.name == artist.value.name) {
    delete artistToEdit.value.name
  }

  if (artistToEdit.value.idYoutubeMusic == artist.value.idYoutubeMusic) {
    delete artistToEdit.value.idYoutubeMusic
  }

  if (artistToEdit.value.type == artist.value.type) {
    delete artistToEdit.value.type
  }

  if (artistToEdit.value.description == artist.value.description) {
    delete artistToEdit.value.description
  }

  if (artistToEdit.value.image == artist.value.image) {
    delete artistToEdit.value.image
  }

  if (artistToEdit.value.platforms == artist.value.platforms) {
    delete artistToEdit.value.platforms
  }

  if (artistToEdit.value.socials == artist.value.socials) {
    delete artistToEdit.value.socials
  }

  if (artistToEdit.value.styles == artist.value.styles) {
    delete artistToEdit.value.styles
  }

  if (artistToEdit.value.groups == artist.value.groups) {
    delete artistToEdit.value.groups
  }

  if (artistToEdit.value.members == artist.value.members) {
    delete artistToEdit.value.members
  }

  const today = new Date()
  today.setDate(today.getDate())
  const todayTimestamp = Timestamp.fromDate(today)
  artistToEdit.value.updatedAt = todayTimestamp

  add('updateArtistPending', artistToEdit.value).then(() => {
    console.log('Document successfully written!')
    toast.success('Artist Update', toastOption)
  }).catch((error) => {
    console.error('Error writing document: ', error)
    toast.warning('Artist Update Failed', toastOption)
  })
}

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})
</script>

<template>
  <div v-if="artist" class="container mx-auto p-5 lg:px-10 min-h-[calc(100vh-60px)] space-y-5">
    <p class="text-lg lg:text-xl font-semibold uppercase border-b border-zinc-700 pb-1">
      Artist Edition : {{ artistToEdit.name }}
    </p>
    <div class="space-y-5">
      <!-- Picture -->
      <div class="flex flex-col gap-2">
        <CbLabel label="Image" />
        <div class="space-y-5">
          <nuxt-img v-if="artistToEdit.image" :src="artistToEdit.image" :alt="artistToEdit.name" quality="80" loading="lazy"
            class="w-full rounded object-cover md:w-auto md:max-w-lg xl:max-w-xl" />
          <div>
            <input ref="imageFile" type="file" accept="image/png, image/jpeg"
              class="cursor-pointer relative m-0 block w-full min-w-0 flex-auto border-b border-solid hover:bg-tertiary border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
              @change.prevent="uploadImageFile($event.target.files)" />
            <p id="file_input_help" class="text-sm text-gray-500 dark:text-gray-300">
              PNG or JPG.
            </p>
          </div>
        </div>
      </div>
      <!-- Name & Id -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CbInput label="Name" placeholder="Name" :value="artistToEdit.name" />
        <CbInput label="Unique Id" placeholder="Unique Id" :value="artistToEdit.id" disabled />
      </div>
      <!-- Id YTM & Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CbInput label="Id Youtube Music" placeholder="Id Youtube Music" :value="artistToEdit.idYoutubeMusic" />
        <div class="grid grid-cols-1 gap-1">
          <CbLabel label="Type" />
          <select v-model="artistToEdit.type"
            class="bg-transparent border-b appearance-none focus:outline-none hover:cursor-pointer">
            <option value="SOLO" class="text-secondary">
              SOLO
            </option>
            <option value="GROUP" class="text-secondary">
              GROUP
            </option>
          </select>
        </div>
      </div>
      <!-- Styles -->
      <div v-if="stylesList" class="flex flex-col gap-1">
        <CbLabel label="Styles" />
        <VueMultiselect v-model="artistToEdit.styles" label="name" track-by="name" placeholder="Search or add a style"
          :options="stylesList" :multiple="true" :close-on-select="false" :clear-on-select="false"
          :preserve-search="false" />
      </div>
      <!-- Description -->
      <div class="flex flex-col gap-1">
        <CbLabel label="Description" />
        <textarea
          class="bg-transparent w-full min-h-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          placeholder="Description" v-model="artistToEdit.description" />
      </div>
      <!-- Group -->
      <div v-if="groupList" class="flex flex-col gap-1">
        <CbLabel label="Group" />
        <VueMultiselect v-model="artistToEdit.groups" label="name" track-by="name" :options="groupList"
          placeholder="Search or add a group" :multiple="true" :close-on-select="false" :clear-on-select="false"
          :preserve-search="false" />
      </div>
      <!-- Members -->
      <div v-if="membersList && artistToEdit.type != 'SOLO'" class="flex flex-col gap-1">
        <CbLabel label="Members" />
        <VueMultiselect v-model="artistToEdit.members" label="name" track-by="name" :options="membersList"
          placeholder="Search or add a member" :multiple="true" :close-on-select="false" :clear-on-select="false"
          :preserve-search="false" />
      </div>
      <!-- Platforms & Socials -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Platforms -->
        <div class="flex flex-col gap-2">
          <CbLabel label="Platforms" />
          <div v-for="platform in artistToEdit.platforms" :key="platform" class="flex w-full gap-1">
            <CbInput placeholder="New Platforms Link" :value="platform" class="w-full" />
            <button class="bg-red-900 text-xs p-1 rounded"
              @click="artistToEdit.platforms.splice(artistToEdit.platforms.indexOf(platform), 1)">
              Delete
            </button>
          </div>
          <button
            class="bg-primary rounded text-sm font-semibold uppercase py-1 hover:scale-105 hover:bg-red-900 transition-all ease-in-out duration-300"
            @click="artistToEdit.platforms.push('')">
            Add Platforms
          </button>
        </div>
        <!-- Socials -->
        <div class="flex flex-col gap-2">
          <CbLabel label="Socials" />
          <div v-for="social in artistToEdit.socials" :key="social" class="flex w-full gap-1">
            <CbInput placeholder="New Socials Link" :value="social" class="w-full" />
            <button class="bg-red-900 text-xs p-1 rounded"
              @click="artistToEdit.socials.splice(artistToEdit.socials.indexOf(platform), 1)">
              Delete
            </button>
          </div>
          <button
            class="bg-primary rounded text-sm font-semibold uppercase py-1 hover:scale-105 hover:bg-red-900 transition-all ease-in-out duration-300"
            @click="artistToEdit.socials.push('')">
            Add Socials
          </button>
        </div>
      </div>

    </div>
    <div class="border-t border-zinc-700 pt-3">
      <button @click="updateArtist"
        class="bg-primary w-full rounded text-xl font-semibold uppercase py-3 hover:scale-105 hover:bg-red-900 transition-all ease-in-out duration-300">
        Saves
      </button>
    </div>
  </div>
</template>

