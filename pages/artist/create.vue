<script setup>
import VueMultiselect from 'vue-multiselect'
import { Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import _ from 'lodash'

definePageMeta({
  middleware: 'auth',
})

const { isAdminStore } = useUserStore()
const { createArtist } = useFirebaseFunction()
const title = ref('Create Artist Page')
const description = ref('Create Artist Page')
const route = useRoute()

const toast = useToast()

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
  type: 'SOLO',
  description: '',
  image: 'https://i.ibb.co/wLhbFZx/Frame-255.png',
  verified: false,
  activeCareer: true,
  platformList: [],
  socialList: [],
  styles: [],
  groups: [],
  members: [],
})

const compareFields = (field1, field2) => {
  return _.isEqual(field1, field2)
}

const sendUpdateArtist = async () => {
	isUploadingEdit.value = true;
	if(artistToEdit.value.idYoutubeMusic == '' || artistToEdit.value.name == ''){
		toast.error('Please fill the required fields');
		isUploadingEdit.value = false;
		return;
	}
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Timestamp.fromDate(today);
  artistToEdit.value['createdAt'] = todayTimestamp;
  artistToEdit.value['updatedAt'] = todayTimestamp;
	if(isAdminStore) {
		artistToEdit.value['verified'] = true;
	}
	createArtist(artistToEdit.value);
	toast.success('Artist created');
	isUploadingEdit.value = false;
}

onMounted(async () => {
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
    class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10"
  >
    <p class="border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl">
      Artist Creation
    </p>
    <div class="space-y-5">
      <!-- Picture -->
      <div class="flex flex-col gap-2">
        <div class="flex items-end gap-1">
            <ComebackLabel label="Image" />
            <p class="italic text-quinary text-sm">Picture will be automaticaly update based on Youtube Music</p>
        </div>
        <NuxtImg
          v-if="artistToEdit.image"
          :src="artistToEdit.image"
          format="webp"
          loading="lazy"
          class="w-full rounded object-cover md:w-auto md:max-w-lg xl:max-w-xl"
        />
      </div>
      <!-- Name & Id -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ComebackInput
          label="Name"
          placeholder="Artist Name*"
          v-model="artistToEdit.name"
        />
        <ComebackInput
          label="Id Youtube Music"
          placeholder="ID Youtube Music*"
          v-model="artistToEdit.idYoutubeMusic"
        />
      </div>
      <!-- Id YTM & Type -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="grid grid-cols-1 gap-1">
          <ComebackLabel label="Type" />
          <select
            v-model="artistToEdit.type"
            class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
          >
            <option value="SOLO" class="text-secondary">SOLO</option>
            <option value="GROUP" class="text-secondary">GROUP</option>
          </select>
        </div>
        <!-- Styles -->
        <div v-if="stylesList" class="flex flex-col gap-1">
            <ComebackLabel label="Styles" />
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
        <ComebackLabel label="Group" />
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
        <ComebackLabel label="Members" />
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
              artistToEdit.socialList.splice(artistToEdit.socialList.indexOf(platform), 1)
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
