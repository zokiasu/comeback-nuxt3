<script setup>
import VueMultiselect from 'vue-multiselect'

const title = ref('Edit Artist Page')
const description = ref('Edit Artist Page')
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
  const route = useRoute()
  artist.value = await fetchArtistBasicInfoById(route.params.id)
  artistToEdit.value.id = artist.value.id
  artistToEdit.value.idYoutubeMusic = artist.value.idYoutubeMusic
  artistToEdit.value.name = artist.value.name
  artistToEdit.value.type = artist.value.type
  artistToEdit.value.description = artist.value.description
  artistToEdit.value.image = artist.value.image
  artistToEdit.value.platforms = artist.value.platforms
  artistToEdit.value.socials = artist.value.socials
  artistToEdit.value.styles = artist.value.styles
  artistToEdit.value.groups = artist.value.groups
  artistToEdit.value.members = artist.value.members
  title.value = 'EDIT ARTIST : ' + artist.value.name
  description.value = artist.value.description
  artistList.value = await fetchArtists()
  // groupList filter with artistList where type == 'GROUP'
  groupList.value = artistList.value.filter(artist => artist.type == 'GROUP')
  // membersList filter with artistList where type == 'SOLO'
  membersList.value = artistList.value.filter(artist => artist.type == 'SOLO')
  stylesList.value = await queryByCollection('general')
  stylesList.value = stylesList.value[0].styles
})

useHead({
  title,
  meta: [{
    name: 'description',
    content: description
  }]
})
</script>

<template>
  <div class="container mx-auto p-5 lg:px-10 min-h-[calc(100vh-60px)] space-y-5">
    <p class="text-lg lg:text-xl font-semibold uppercase border-b border-zinc-800 pb-1">Artist Edition : {{
      artistToEdit.name }}</p>
    <div class="space-y-5">
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
          <select class="bg-transparent border-b appearance-none focus:outline-none hover:cursor-pointer"
            v-model="artistToEdit.type">
            <option value="SOLO" class="text-secondary">SOLO
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
        <VueMultiselect v-model="artistToEdit.styles" label="name" track-by="name" :options="stylesList"
          placeholder="Search or add a style" :multiple="true" :close-on-select="false" :clear-on-select="false"
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
          placeholder="Search or add a style" :multiple="true" :close-on-select="false" :clear-on-select="false"
          :preserve-search="false" />
      </div>
      <!-- Members -->
      <div v-if="membersList && artistToEdit.type != 'SOLO'" class="flex flex-col gap-1">
        <CbLabel label="Members" />
        <VueMultiselect v-model="artistToEdit.members" label="name" track-by="name" :options="membersList"
          placeholder="Search or add a style" :multiple="true" :close-on-select="false" :clear-on-select="false"
          :preserve-search="false" />
      </div>
    </div>
  </div>
</template>

