<script setup>
import { useToast } from "vue-toastification";
const artistUpdateList = ref([])
const toast = useToast();

onMounted(async () => {
  artistUpdateList.value = await queryByCollection('updateArtistPending')
})

const deleteEdition = async (id, index) => {
  await deleteByCollection('updateArtistPending', id)
  artistUpdateList.value.splice(index, 1)
  toast.success('Artist Pending Deleted', {
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
  })
}

const confirmEdition = async (id, artist, index) => {
  updateArtist(id, artist).then(async () => {
    await deleteByCollection('updateArtistPending', id)
    artistUpdateList.value.splice(index, 1)
    toast.success('Artist Updated', {
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
    })
  })
}
</script>

<template>
  <div>
    <transition-group v-if="artistUpdateList.length" name="list-complete" tag="div" class="transition-all ease-in-out duration-300 grid grid-cols-1 items-center justify-center gap-5">
      <div v-for="(artist, index) in artistUpdateList" :key="artist.id" class="list-complete-item bg-zinc-500 h-full w-full p-2 space-y-2">
        <CardDashboardArtistUpdate 
          :id="artist.id"
          :taskId="artist.taskId"
          :name="artist.name"
          :image="artist.image"
          :description="artist.description"
          :type="artist.type"
          :idYoutubeMusic="artist.idYoutubeMusic"
          :styles="artist.styles"
          :socials="artist.socials"
          :platforms="artist.platforms"
          :groups="artist.groups"
          :members="artist.members"
        />
        <div class="grid grid-cols-2 gap-2">
          <button @click="confirmEdition(artist.taskId, artist, index)" class="bg-green-700 font-semibold rounded uppercase transition-all ease-in-out duration-300 hover:bg-green-500">
            Confirm
          </button>
          <button @click="deleteEdition(artist.taskId, index)" class="bg-red-700 font-semibold rounded uppercase transition-all ease-in-out duration-300 hover:bg-red-500">
            Reject
          </button>
        </div>
      </div>
    </transition-group>
    <p v-else class="uppercase font-semibold bg-quaternary w-full p-5 text-center">
      No pending artist updates
    </p>
  </div>
</template>