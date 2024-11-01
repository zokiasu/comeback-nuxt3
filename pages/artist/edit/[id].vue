<script setup>
import VueMultiselect from 'vue-multiselect'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import * as Mdl from '@kouts/vue-modal'
import _ from 'lodash'

definePageMeta({
  middleware: 'auth',
})

const ModalCreateArtist = defineAsyncComponent(() =>
  import('@/components/ModalCreateArtist.vue')
)

const { Modal } = Mdl
const route = useRoute()
const toast = useToast()
const { isAdminStore } = useUserStore()
const { getArtistByIdWithGroupsAndMembers, updateArtist } = useFirebaseFunction()

const title = ref('Edit Artist Page')
const description = ref('Edit Artist Page')

const isUploadingEdit = ref(false)
const showModalCreateArtist = ref(false)
const artist = ref(null)
const groupList = ref(null)
const membersList = ref(null)
const artistList = ref(null)
const stylesList = ref(null)
const tagsList = ref(null)
const birthdayToDateFormat = ref(null)
const debutDateToDateFormat = ref(null)
const artistToEdit = ref({
  id: '',
  idYoutubeMusic: '',
  name: '',
  type: '',
  description: '',
  image: '',
  gender: 'UNKNOWN',
  verified: true,
  activeCareer: true,
  birthDate: null,
  debutDate: null,
  platformList: [],
  socialList: [],
  styles: [],
  generalTags: [],
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
    toast.error('No field to update')
    return;
  }

  const today = new Date()
  today.setDate(today.getDate())
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = Timestamp.fromDate(today)
  updatedFields['updatedAt'] = todayTimestamp

  if (isAdminStore) {
    // update artist without verifying
    updatedFields['id'] = artist.value.id
    updateArtist(updatedFields).then(async () => {
      toast.success('Artist Updated')
      const router = useRouter()
      router.push(`/artist/${route.params.id}`)
    })
  } else {
    //addd pending artist
    add('updateArtistPending', updatedFields)
      .then(() => {
        isUploadingEdit.value = false
        toast.success('Artist Update')
        const router = useRouter()
        router.push(`/artist/${route.params.id}`)
      })
      .catch((error) => {
        console.error('Error writing document: ', error)
        toast.warning('Artist Update Failed')
      })
  }
}

const closeModalCreateArtist = async () => {
  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
  membersList.value = artistList.value
  showModalCreateArtist.value = false
}

const adjustTextarea = (event) => {
  const textarea = event.target || event // Cibler le textarea via `ref` ou l'événement d'entrée
  textarea.style.height = 'auto' // Réinitialise la hauteur pour recalculer correctement
  textarea.style.height = `${textarea.scrollHeight}px` // Ajuste la hauteur à la hauteur de contenu
}

watch(birthdayToDateFormat, () => {
  if(birthdayToDateFormat.value) {
    console.log('birthdayToDateFormat', birthdayToDateFormat.value)
    const tmpDate = new Date(birthdayToDateFormat.value)
    tmpDate.setHours(0, 0, 0, 0)
    artistToEdit.value.birthDate = Timestamp.fromDate(tmpDate)
  } else {
    artistToEdit.value.birthDate = null
  }
})

watch(debutDateToDateFormat, () => {
  if(debutDateToDateFormat.value) {
    console.log('debutDateToDateFormat', debutDateToDateFormat.value)
    const tmpDate = new Date(debutDateToDateFormat.value)
    tmpDate.setHours(0, 0, 0, 0)
    artistToEdit.value.debutDate = Timestamp.fromDate(tmpDate)
  } else {
    artistToEdit.value.debutDate = null
  }
})

onMounted(async () => {
  artist.value = await getArtistByIdWithGroupsAndMembers(route.params.id)
  artistToEdit.value = await getArtistByIdWithGroupsAndMembers(route.params.id)

  title.value = 'EDIT ARTIST : ' + artist.value.name
  description.value = artist.value.description

  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
  membersList.value = artistList.value

  const generalData = await queryByCollection('general')
  stylesList.value = generalData[0].styles
  tagsList.value = generalData[0].generalTags

  const textarea = document.querySelector('textarea') // Vous pouvez aussi utiliser this.$refs si applicable
  if (textarea) {
    adjustTextarea(textarea)
  }
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
    <div class="flex items-end justify-between pb-1 text-lg font-semibold uppercase border-b border-zinc-700 lg:text-xl">
      <p>Artist Edition : {{ artistToEdit.name }}</p>
      <button
        @click="sendUpdateArtist"
        :disabled="isUploadingEdit"
        class="px-3 py-1 text-base font-semibold uppercase transition-all duration-300 ease-in-out rounded w-fit bg-primary hover:scale-105 hover:bg-red-900"
      >
        {{ isUploadingEdit ? 'Loading' : 'Saves' }}
      </button>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <!-- Picture -->
      <div class="flex flex-col gap-2">
        <div class="flex items-end gap-2">
          <ComebackLabel label="Image" />
          <p class="text-sm italic text-quinary">Picture will be automaticaly update based on Youtube Music</p>
        </div>
        <NuxtImg
          v-if="artistToEdit.image"
          :src="artistToEdit.image"
          :alt="artistToEdit.name"
          format="webp"
          loading="lazy"
          class="object-cover w-full rounded"
        />
      </div>
      <!-- Name & Id YTM & Birthday & Debut Date -->
      <div class="space-y-5">
        <ComebackInput
          label="Unique Id"
          :placeholder="artist.id"
          v-model="artistToEdit.id"
          disabled
        />
        <ComebackInput
          label="Name"
          :placeholder="artist.name"
          v-model="artistToEdit.name"
        />
        <ComebackInput
          label="Id Youtube Music"
          :placeholder="artist.idYoutubeMusic"
          v-model="artistToEdit.idYoutubeMusic"
        />
        <!-- Birthday & Debut Date -->
        <div class="grid grid-cols-1 gap-5" :class="{ 'md:grid-cols-2': artistToEdit.type == 'SOLO' }">
          <div class="space-y-1" :class="{ 'hidden': artistToEdit.type == 'GROUP' }">
            <ComebackLabel label="Birthday" />
            <VueDatePicker 
              v-model="birthdayToDateFormat" 
              placeholder="Select Date" 
              auto-apply 
              :enable-time-picker="false" 
              dark
            />
          </div>
          <div class="space-y-1">
            <ComebackLabel label="Debut Date" />
            <VueDatePicker 
              v-model="debutDateToDateFormat" 
              placeholder="Select Date" 
              auto-apply 
              :enable-time-picker="false" 
              dark
            />
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-5">
      <!-- Gender & Type & Active Career -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <!-- Gender -->
        <div class="grid grid-cols-1 gap-1">
          <div class="flex items-end gap-2">
            <ComebackLabel label="Gender" />
            <p class="text-sm italic text-quinary">It's only for stat we don't assume any gender jugement</p>
          </div>
          <select
            v-model="artistToEdit.gender"
            class="bg-transparent border-b appearance-none hover:cursor-pointer focus:outline-none"
          >
            <option default value="UNKNOWN" class="text-secondary">UNKNOWN</option>
            <option value="MALE" class="text-secondary">MALE</option>
            <option value="FEMALE" class="text-secondary">FEMALE</option>
            <option value="MIXTE" class="text-secondary">MIXTE</option>
          </select>
        </div>
        <!-- Type -->
        <div class="grid grid-cols-1 gap-1">
          <ComebackLabel label="Type" />
          <select
            v-model="artistToEdit.type"
            class="bg-transparent border-b appearance-none hover:cursor-pointer focus:outline-none"
          >
            <option value="SOLO" class="text-secondary">SOLO</option>
            <option value="GROUP" class="text-secondary">GROUP</option>
          </select>
        </div>
        <!-- Active Career -->
        <div class="grid grid-cols-1 gap-1">
          <ComebackLabel label="Active Career" />
          <select
            v-model="artistToEdit.activeCareer"
            class="bg-transparent border-b appearance-none hover:cursor-pointer focus:outline-none"
          >
            <option :value="true" class="text-secondary">Active</option>
            <option :value="false" class="text-secondary">Inactive</option>
          </select>
        </div>
      </div>
      <!-- Styles & General Tags -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <!-- Styles -->
        <div v-if="stylesList" class="flex flex-col gap-1">
          <ComebackLabel label="Styles" />
          <VueMultiselect
            v-model="artistToEdit.styles"
            label="name"
            track-by="name"
            placeholder="Add a style"
            :options="stylesList"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="false"
          />
        </div>
        <!-- General Tags -->
        <div v-if="tagsList" class="flex flex-col gap-1">
          <ComebackLabel label="General Tags" />
          <VueMultiselect
            v-model="artistToEdit.generalTags"
            label="name"
            track-by="name"
            placeholder="Add a tag"
            :options="tagsList"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="false"
          />
        </div>
      </div>
      <!-- Description -->
      <div class="flex flex-col gap-1">
        <ComebackLabel label="Description" />
        <textarea
          :placeholder="artistToEdit.description || 'Description'"
          v-model="artistToEdit.description"
          class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
        />
      </div>
      <!-- Group -->
      <div v-if="groupList" class="flex flex-col gap-1">
        <div class="flex justify-between gap-3">
          <ComebackLabel label="Group" />
          <button
            v-if="isAdminStore"
            class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
            @click="showModalCreateArtist = true"
          >
            Create New Artist
          </button>
        </div>
        <VueMultiselect
          v-model="artistToEdit.groups"
          label="name"
          track-by="name"
          :options="groupList"
          placeholder="Search a group"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Members -->
      <div v-if="membersList && artistToEdit.type != 'SOLO'" class="flex flex-col gap-1">
        <div class="flex justify-between gap-3">
          <ComebackLabel label="Members" />
          <button
            v-if="isAdminStore"
            class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
            @click="showModalCreateArtist = true"
          >
            Create New Artist
          </button>
        </div>
        <VueMultiselect
          v-model="artistToEdit.members"
          label="name"
          track-by="name"
          :options="membersList"
          placeholder="Search a member"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="false"
        />
      </div>
      <!-- Platforms & Socials -->
      <div class="flex gap-2">
        <!-- Platforms -->
        <div class="w-full space-y-2">
          <ComebackLabel label="Platforms" />
          <div
            v-for="(platform, index) in artistToEdit.platformList"
            :key="platform"
            class="flex w-full gap-1"
          >
            <div class="w-full p-2 space-y-3 text-xs rounded bg-quinary">
              <input
                type="text"
                :value="platform.name"
                placeholder="Platform's Name"
                @input="artistToEdit.platformList[index].name = $event.target.value"
                class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
              />
              <input
                type="text"
                :value="platform.link"
                placeholder="Platform's Link"
                @input="artistToEdit.platformList[index].link = $event.target.value"
                class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
              />
            </div>
            <button
              class="p-5 text-xs rounded bg-primary hover:bg-red-900"
              @click="
                artistToEdit.platformList.splice(
                  artistToEdit.platformList.indexOf(platform),
                  1,
                )
              "
            >
              Delete
            </button>
          </div>
          <button
            class="w-full p-2 text-xs font-semibold uppercase rounded bg-primary hover:bg-red-900"
            @click="artistToEdit.platformList.push({ name: '', link: '' })"
          >
            Add Platforms
          </button>
        </div>
        <!-- Socials -->
        <div class="w-full space-y-2">
          <ComebackLabel label="Socials" />
          <div
            v-for="(social, index) in artistToEdit.socialList"
            :key="social"
            class="flex w-full gap-2"
          >
            <div class="w-full p-2 space-y-3 text-xs rounded bg-quinary">
              <input
                type="text"
                :value="social.name"
                placeholder="Social's Name"
                @input="artistToEdit.socialList[index].name = $event.target.value"
                class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
              />
              <input
                type="text"
                :value="social.link"
                placeholder="Social's Link"
                @input="artistToEdit.socialList[index].link = $event.target.value"
                class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
              />
            </div>
            <button
              class="p-5 text-xs rounded bg-primary hover:bg-red-900"
              @click="
                artistToEdit.socialList.splice(artistToEdit.socialList.indexOf(platform), 1)
              "
            >
              Delete
            </button>
          </div>
          <button
            class="w-full p-2 text-xs font-semibold uppercase rounded bg-primary hover:bg-red-900"
            @click="artistToEdit.socialList.push({ name: '', link: '' })"
          >
            Add Socials
          </button>
        </div>
      </div>
    </div>

    <div class="pt-3 border-t border-zinc-700">
      <button
        @click="sendUpdateArtist"
        :disabled="isUploadingEdit"
        class="w-full py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out rounded bg-primary hover:scale-105 hover:bg-red-900"
      >
        {{ isUploadingEdit ? 'Loading' : 'Saves' }}
      </button>
    </div>
    
    <Modal
      v-model="showModalCreateArtist"
      title="Create Artist"
      wrapper-class="modal-wrapper"
      :modal-class="`modal-lg`"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__bounceIn`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <ModalCreateArtist
        :stylesList="stylesList"
        :tagsList="tagsList"
        :groupList="groupList"
        :membersList="membersList"
        @close-modal="closeModalCreateArtist"
      />
    </Modal>
  </div>
</template>
