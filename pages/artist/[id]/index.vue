<script setup>
const title = ref('Artist Page')
const description = ref('Artist')
const route = useRoute()
const artist = ref(null)
const imageBackground = ref(null)
const editLink = ref('/artist/edit/' + route.params.id)


onMounted(async () => {
  artist.value = await fetchArtistFullInfoById(route.params.id)
  imageBackground.value = artist.value.image
  title.value = artist.value.name
  description.value = artist.value.description
})

// computed Solo members
const soloMembers = computed(() => {
  return artist.value.members.filter((member) => member.type === 'SOLO')
})
// computed groupMembers
const groupMembers = computed(() => {
  return artist.value.groups.filter((member) => member.type === 'GROUP')
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
  <div v-if="artist">
    <section
      class="background-top relative h-[20vh] overflow-hidden bg-cover bg-no-repeat md:h-[30vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]">
      <nuxt-img :src="imageBackground" :alt="artist.name+'_back'" quality="80" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 flex items-center bg-secondary/60 p-5 lg:p-10 xl:p-14 xl:px-32">
        <div class="flex items-center space-x-5">
          <div class="relative hidden overflow-hidden xl:block">
            <nuxt-img :src="imageBackground" :alt="artist.name" quality="80" loading="lazy"
              class="aspect-video h-80 rounded-md object-cover drop-shadow-2xl transition-all duration-150 hover:scale-105" />
          </div>
          <div class="space-y-2">
            <h1 class="font-semibold text-3xl md:text-6xl lg:text-7xl">
              {{ artist.name }}
            </h1>
            <div v-if="artist.platforms.length" class="flex flex-wrap gap-3 md:gap-3">
              <LazyCbExternalLink v-for="link in artist.platforms" :key="link" :href="link" />
            </div>
            <div v-if="artist.socials.length" class="flex flex-wrap gap-3 md:gap-3">
              <LazyCbExternalLink v-for="link in artist.socials" :key="link" :href="link" />
            </div>
            <div>
              <NuxtLink :to="editLink" class=" bg-secondary px-2 py-1 uppercase text-xs font-semibold">
                Edit Artist
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto p-5 space-y-8">
      <p v-if="artist.description" class="whitespace-pre-line">
        {{ artist.description }}
      </p>
      <div v-if="soloMembers?.length">
        <CardDefault name="Members" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist v-for="soloMember in soloMembers" :id="soloMember.id" :key="soloMember.id"
              :image="soloMember.image" :name="soloMember.name" />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="artist.releases?.length">
        <CardDefault name="Releases" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardRelease v-for="release in artist.releases" :key="release.id" :id="release.id" :image="release.image"
              :date="release.date" :name="release.name" :type="release.type" :artistsId="release.artistsId"
              :artistsName="release.artistsName" :displayDate="true" />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="groupMembers?.length">
        <CardDefault name="Subunit" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist v-for="groupMember in groupMembers" :id="groupMember.id" :key="groupMember.id" :image="groupMember.image" :name="groupMember.name" />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="groups?.length">
        <CardDefault name="Group's Unit" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist v-for="group in groups" :id="group.id" :key="group.id" :image="group.image" :name="group.name" />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="artist.news?.length">
        <CardDefault name="Last Comeback">
          <transition-group name="list-complete" tag="div" class="py-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            <LazyCardNews v-for="news in artist.news" :key="news.id" :message="news.message" :date="news.date" :artist="news.artist" />
          </transition-group>
        </CardDefault>
      </div>
    </section>
  </div>
</template>