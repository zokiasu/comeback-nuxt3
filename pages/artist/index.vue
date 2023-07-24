<script setup>
const artistFetch = ref(null)

onMounted(async () => {
  artistFetch.value = await fetchArtists()
})

const search = ref('')

const filteredArtistList = computed(() => {
  if (!search.value) return artistFetch.value
  return artistFetch.value.filter((artist) => {
    return artist.name.toLowerCase().includes(search.value.toLowerCase())
  })
})

useHead({
  title: 'Artist List',
  meta: [{
    name: 'description',
    content: 'Artist List'
  }]
})
</script>

<template>
  <div class="container mx-auto min-h-screen p-5 space-y-5">
    <div id="searchbar" class="flex w-full justify-start">
      <input id="search-input" v-model="search" type="text" placeholder="Search"
        class="w-full rounded-full border-none bg-quinary py-2 px-5 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none" />
    </div>
    <transition-group id="artist-list" name="list-complete" tag="div"
      class="transition-all ease-in-out duration-300 grid grid-cols-2 items-center justify-center gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
      <LazyCardArtist v-for="artist in filteredArtistList" :key="artist.id" :id="artist.id" :image="artist.image"
        :name="artist.name" :type="artist.type" :artistsId="artist.artistsId" :artistsName="artist.artistsName"
        :displayDate="true" class="list-complete-item" />
    </transition-group>
  </div>
</template>