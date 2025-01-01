<script setup>
import VueMultiselect from 'vue-multiselect'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'
import { Timestamp, doc, onSnapshot } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import * as Mdl from '@kouts/vue-modal'
import _ from 'lodash'

definePageMeta({
  middleware: 'auth',
})

const { Modal } = Mdl
const toast = useToast()
const { $firestore: db } = useNuxtApp()
const { isAdminStore } = useUserStore()
const { createArtist } = useFirebaseFunction()

const title = ref('Create Artist Page')
const description = ref('Create Artist Page')

const isUploadingEdit = ref(false)
const showModalCreateArtist = ref(false)
const showModalCreateStyle = ref(false)
const showModalCreateTag = ref(false)

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
  type: 'SOLO',
  description: '',
  image: 'https://i.ibb.co/wLhbFZx/Frame-255.png',
  verified: false,
  activeCareer: true,
  gender: 'UNKNOWN',
  birthDate: null,
  debutDate: null,
  platformList: [],
  socialList: [],
  styles: [],
  generalTags: [],
  groups: [],
  members: [],
})

const closeModalCreateStyle = () => {
  showModalCreateStyle.value = false
}

const closeModalCreateTag = () => {
  showModalCreateTag.value = false
}

const sendUpdateArtist = async () => {
  isUploadingEdit.value = true

  if (artistToEdit.value.name == '') {
    toast.error('Please fill the required fields')
    isUploadingEdit.value = false
    return
  }

  const today = new Date()

  today.setDate(today.getDate())
  today.setHours(0, 0, 0, 0)

  const todayTimestamp = Timestamp.fromDate(today)

  artistToEdit.value['createdAt'] = todayTimestamp
  artistToEdit.value['updatedAt'] = todayTimestamp

  if (isAdminStore) {
    artistToEdit.value['verified'] = true
  }
  
  createArtist(artistToEdit.value)
    .then((res) => {
      if (res != null) {
        toast.success('Artist created')
        isUploadingEdit.value = false
        const router = useRouter()
        router.push(`/`)
      } else {
        toast.error('Error: Artist not created')
        isUploadingEdit.value = false
      }
    })
    .catch((error) => {
      toast.error('Error: ' + error)
      isUploadingEdit.value = false
    })
}

const closeModalCreateArtist = async () => {
  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
  membersList.value = artistList.value
  showModalCreateArtist.value = false
}

const adjustTextarea = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
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
  artistList.value = await queryByCollection('artists')
  groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
  membersList.value = artistList.value

  onSnapshot(doc(db, 'general', 'data'), (doc) => {
    if (!doc.exists()) return

    console.log('doc', doc.data())
    
    stylesList.value = doc?.data().styles
    tagsList.value = doc?.data().generalTags

    stylesList.value.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    tagsList.value.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  })
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
  <div class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10">
    <div
      class="flex items-center justify-between border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl"
    >
      <p>Artist Creation</p>
      <div>
        <button
          @click="sendUpdateArtist"
          :disabled="isUploadingEdit"
          class="w-full rounded bg-primary px-5 py-3 text-xs font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
        >
          {{ isUploadingEdit ? 'Loading' : 'Saves' }}
        </button>
      </div>
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
      <div class="space-y-4">
        <ComebackInput
          label="Name *"
          placeholder="Artist Name*"
          v-model="artistToEdit.name"
        />
        <ComebackInput
          label="Id Youtube Music *"
          placeholder="ID Youtube Music"
          v-model="artistToEdit.idYoutubeMusic"
        />
        <!-- Birthday -->
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
        <!-- Debut Date -->
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
          <div class="flex justify-between gap-3">
            <ComebackLabel label="Styles" />
            <button
              class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
              @click="showModalCreateStyle = true"
            >
              Create New Style
            </button>
          </div>
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
          <div class="flex justify-between gap-3">
            <ComebackLabel label="General Tags" />
            <button
              class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
              @click="showModalCreateTag = true"
            >
              Create New Tag
            </button>
          </div>
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
          v-model="artistToEdit.description"
          :placeholder="artistToEdit.description || 'Description'"
          @input="adjustTextarea($event)"
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
            <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
              <input
                type="text"
                :value="platform.name"
                placeholder="Platform's Name"
                @input="artistToEdit.platformList[index].name = $event.target.value"
                class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
              />
              <input
                type="text"
                :value="platform.link"
                placeholder="Platform's Link"
                @input="artistToEdit.platformList[index].link = $event.target.value"
                class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
              />
            </div>
            <button
              class="rounded bg-primary p-5 text-xs hover:bg-red-900"
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
            class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
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
            <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
              <input
                type="text"
                :value="social.name"
                placeholder="Social's Name"
                @input="artistToEdit.socialList[index].name = $event.target.value"
                class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
              />
              <input
                type="text"
                :value="social.link"
                placeholder="Social's Link"
                @input="artistToEdit.socialList[index].link = $event.target.value"
                class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
              />
            </div>
            <button
              class="rounded bg-primary p-5 text-xs hover:bg-red-900"
              @click="
                artistToEdit.socialList.splice(
                  artistToEdit.socialList.indexOf(platform),
                  1,
                )
              "
            >
              Delete
            </button>
          </div>
          <button
            class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
            @click="artistToEdit.socialList.push({ name: '', link: '' })"
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
    
    <Modal
      v-model="showModalCreateStyle"
      title="Create Style"
      wrapper-class="modal-wrapper"
      :modal-class="`modal-lg`"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__bounceIn`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <ModalCreateStyleTag
        :styleFetch="stylesList"
        @close-modal="closeModalCreateStyle"
      />
    </Modal>
    
    <Modal
      v-model="showModalCreateTag"
      title="Create Tag"
      wrapper-class="modal-wrapper"
      :modal-class="`modal-lg`"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__bounceIn`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <ModalCreateTag
        :generalTags="tagsList"
        @close-modal="closeModalCreateTag"
      />
    </Modal>
  </div>
</template>
