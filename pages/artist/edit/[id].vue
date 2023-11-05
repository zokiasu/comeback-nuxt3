<script setup>
import VueMultiselect from 'vue-multiselect'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import _ from 'lodash'

definePageMeta({
  middleware: 'auth',
})

const { isAdminStore } = useUserStore()
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

const compareFields = (field1, field2) => {
  return _.isEqual(field1, field2)
}

const sendUpdateArtist = async () => {
  // isUploadingEdit.value = true
  const updatedFields = {}

  Object.keys(artistToEdit.value).forEach((key) => {
    if (!compareFields(artistToEdit.value[key], artist.value[key])) {
      updatedFields[key] = artistToEdit.value[key]
    }
  })

  // if artistToEdit doesn't have any field to update then return
  if (Object.keys(updatedFields).length == 0) {
    console.log('updatedFields', updatedFields)
    return
  }

  const today = new Date()
  today.setDate(today.getDate())
  // set hour to 00:00:00
  today.setHours(0, 0, 0, 0)
  console.log('today', today)
  const todayTimestamp = Timestamp.fromDate(today)
  updatedFields['updatedAt'] = todayTimestamp

  if (isAdminStore) {
    // update artist without verifying
    updatedFields['id'] = artist.value.id
    updateArtist(updatedFields).then(async () => {
      toast.success('Artist Updated', toastOption)
      const router = useRouter()
      router.push(`/artist/${route.params.id}`)
    })
  } else {
    //addd pending artist
    add('updateArtistPending', updatedFields)
      .then(() => {
        console.log('Document successfully written!')
        isUploadingEdit.value = false
        toast.success('Artist Update', toastOption)
        const router = useRouter()
        router.push(`/artist/${route.params.id}`)
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
        toast.warning('Artist Update Failed', toastOption)
      })
  }
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
        <NuxtImg
          v-if="artistToEdit.image"
          :src="artistToEdit.image"
          :alt="artistToEdit.name"
          format="webp"
          loading="lazy"
          class="w-full rounded object-cover md:w-auto md:max-w-lg xl:max-w-xl"
        />
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
        @click="sendUpdateArtist"
        :disabled="isUploadingEdit"
        class="w-full rounded bg-primary py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
      >
        {{ isUploadingEdit ? 'Loading' : 'Saves' }}
      </button>
    </div>
  </div>
</template>
