<script setup>
import * as fire from 'firebase/storage'
import VueMultiselect from 'vue-multiselect'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'

definePageMeta({
  middleware: 'admin',
})

const title = ref('Edit Artist Page')
const description = ref('Edit Artist Page')
const route = useRoute()

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
const isUploadingImage = ref(false)
const isUploadingEdit = ref(false)
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
  members: [],
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

  fire
    .uploadBytes(storageRef.value, file, metadata)
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
  isUploadingEdit.value = true
  // verify each field from artistToEdit is not equal to artist's field
  if (
    artistToEdit.value.name == artist.value.name &&
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
    isUploadingEdit.value = false
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

  if (artistToEdit.value.platforms.length == artist.value.platforms.length) {
    let isSame = true
    artistToEdit.value.platforms.forEach((platform) => {
      if (!artist.value.platforms.includes(platform)) {
        isSame = false
      }
    })
    if (isSame) {
      delete artistToEdit.value.platforms
    }
  }

  if (artistToEdit.value.socials.length == artist.value.socials.length) {
    let isSame = true
    artistToEdit.value.socials.forEach((social) => {
      if (!artist.value.socials.includes(social)) {
        isSame = false
      }
    })
    if (isSame) {
      delete artistToEdit.value.socials
    }
  }

  if (artistToEdit.value.styles.length == artist.value.styles.length) {
    let isSame = true
    artistToEdit.value.styles.forEach((style) => {
      if (!artist.value.styles.includes(style)) {
        isSame = false
      }
    })
    if (isSame) {
      delete artistToEdit.value.styles
    }
  }

  if (artistToEdit.value.groups.length == artist.value.groups.length) {
    let isSame = true
    artistToEdit.value.groups.forEach((group) => {
      if (!artist.value.groups.includes(group)) {
        isSame = false
      }
    })
    if (isSame) {
      delete artistToEdit.value.groups
    }
  }

  if (artistToEdit.value.members.length == artist.value.members.length) {
    let isSame = true
    artistToEdit.value.members.forEach((member) => {
      if (!artist.value.members.includes(member)) {
        isSame = false
      }
    })
    if (isSame) {
      delete artistToEdit.value.members
    }
  }

  const today = new Date()
  today.setDate(today.getDate())
  const todayTimestamp = Timestamp.fromDate(today)
  artistToEdit.value.updatedAt = todayTimestamp

  add('updateArtistPending', artistToEdit.value)
    .then(() => {
      console.log('Document successfully written!')
      isUploadingEdit.value = false
      toast.success('Artist Update', toastOption)
    })
    .catch((error) => {
      console.error('Error writing document: ', error)
      toast.warning('Artist Update Failed', toastOption)
    })
}

onMounted(async () => {
  artist.value = await fetchArtistBasicInfoById(route.params.id)
  artistToEdit.value = await fetchArtistBasicInfoById(route.params.id)

  title.value = 'EDIT ARTIST : ' + artist.value.name
  description.value = artist.value.description

  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
  membersList.value = artistList.value.filter((artist) => artist.type == 'SOLO')

  stylesList.value = await queryByCollection('general')
  stylesList.value = stylesList.value[0].styles
})

useHead({
  title,
  meta: [
    {
      name: 'description',
      content: description,
    },
  ],
})
</script>

<template>
  <div
    v-if="artist"
    class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10"
  >
    <p class="border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl">
      Artist Edition : {{ artistToEdit.name }}
    </p>
    <div class="space-y-5">
      <!-- Picture -->
      <div class="flex flex-col gap-2">
        <CbLabel label="Image" />
        <div class="space-y-5">
          <nuxt-img
            v-if="artistToEdit.image"
            :src="artistToEdit.image"
            :alt="artistToEdit.name"
            quality="80"
            loading="lazy"
            class="w-full rounded object-cover md:w-auto md:max-w-lg xl:max-w-xl"
          />
          <div>
            <input
              ref="imageFile"
              type="file"
              accept="image/png, image/jpeg"
              class="focus:shadow-te-primary relative m-0 block w-full min-w-0 flex-auto cursor-pointer border-b border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:bg-tertiary focus:text-neutral-700 focus:outline-none"
              @change.prevent="uploadImageFile($event.target.files)"
            />
            <p id="file_input_help" class="text-sm text-gray-500 dark:text-gray-300">
              PNG or JPG.
            </p>
          </div>
        </div>
      </div>
      <!-- Name & Id -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CbInput label="Name" :placeholder="artist.name" v-model="artistToEdit.name" />
        <CbInput
          label="Unique Id"
          :placeholder="artist.id"
          v-model="artistToEdit.id"
          disabled
        />
      </div>
      <!-- Id YTM & Type -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <CbInput
          label="Id Youtube Music"
          :placeholder="artist.idYoutubeMusic"
          v-model="artistToEdit.idYoutubeMusic"
        />
        <div class="grid grid-cols-1 gap-1">
          <CbLabel label="Type" />
          <select
            v-model="artistToEdit.type"
            class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
          >
            <option value="SOLO" class="text-secondary">SOLO</option>
            <option value="GROUP" class="text-secondary">GROUP</option>
          </select>
        </div>
      </div>
      <!-- Styles -->
      <div v-if="stylesList" class="flex flex-col gap-1">
        <CbLabel label="Styles" />
        <VueMultiselect
          v-model="artistToEdit.styles"
          label="name"
          track-by="name"
          placeholder="Search or add a style"
          :options="stylesList"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Description -->
      <div class="flex flex-col gap-1">
        <CbLabel label="Description" />
        <textarea
          :placeholder="artistToEdit.description || 'Description'"
          v-model="artistToEdit.description"
          class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
        />
      </div>
      <!-- Group -->
      <div v-if="groupList" class="flex flex-col gap-1">
        <CbLabel label="Group" />
        <VueMultiselect
          v-model="artistToEdit.groups"
          label="name"
          track-by="name"
          :options="groupList"
          placeholder="Search or add a group"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Members -->
      <div v-if="membersList && artistToEdit.type != 'SOLO'" class="flex flex-col gap-1">
        <CbLabel label="Members" />
        <VueMultiselect
          v-model="artistToEdit.members"
          label="name"
          track-by="name"
          :options="membersList"
          placeholder="Search or add a member"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Platforms & Socials -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <!-- Platforms -->
        <div class="flex flex-col gap-2">
          <CbLabel label="Platforms" />
          <div
            v-for="(platform, index) in artistToEdit.platforms"
            :key="platform"
            class="flex w-full gap-1"
          >
            <input
              type="text"
              :value="platform"
              @input="artistToEdit.platforms[index] = $event.target.value"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
            <button
              class="rounded bg-red-900 p-1 text-xs"
              @click="
                artistToEdit.platforms.splice(artistToEdit.platforms.indexOf(platform), 1)
              "
            >
              Delete
            </button>
          </div>
          <button
            class="rounded bg-primary py-1 text-sm font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
            @click="artistToEdit.platforms.push('')"
          >
            Add Platforms
          </button>
        </div>
        <!-- Socials -->
        <div class="flex flex-col gap-2">
          <CbLabel label="Socials" />
          <div
            v-for="(social, index) in artistToEdit.socials"
            :key="social"
            class="flex w-full gap-1"
          >
            <input
              type="text"
              :value="social"
              @input="artistToEdit.socials[index] = $event.target.value"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
            <button
              class="rounded bg-red-900 p-1 text-xs"
              @click="
                artistToEdit.socials.splice(artistToEdit.socials.indexOf(platform), 1)
              "
            >
              Delete
            </button>
          </div>
          <button
            class="rounded bg-primary py-1 text-sm font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
            @click="artistToEdit.socials.push('')"
          >
            Add Socials
          </button>
        </div>
      </div>
    </div>
    <div class="border-t border-zinc-700 pt-3">
      <button
        @click="updateArtist"
        :disabled="isUploadingEdit"
        class="w-full rounded bg-primary py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
      >
        {{ isUploadingEdit ? 'Loading' : 'Saves' }}
      </button>
    </div>
  </div>
</template>
