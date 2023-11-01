<script setup>
import { useUserStore } from '@/stores/user'
const { isAdminStore } = useUserStore()

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

// computed members
const members = computed(() => {
  return artist.value.members.filter((member) => member.type === 'SOLO')
})
// computed subUnitMembers
const subUnitMembers = computed(() => {
  return artist.value.members.filter((member) => member.type === 'GROUP')
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
  <div v-if="artist">
    <section
      class="background-top relative h-[20vh] overflow-hidden bg-cover bg-no-repeat md:h-[30vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
    >
      <nuxt-img
        :src="imageBackground"
        :alt="artist.name + '_back'"
        quality="80"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 flex items-center bg-secondary/60 p-5 lg:p-10 xl:p-14 xl:px-32"
      >
        <div class="flex items-center space-x-5">
          <div class="relative hidden overflow-hidden xl:block">
            <nuxt-img
              :src="imageBackground"
              :alt="artist.name"
              quality="80"
              loading="lazy"
              class="aspect-video h-80 rounded-md object-cover drop-shadow-2xl transition-all duration-150 hover:scale-105"
            />
          </div>
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold md:text-6xl lg:text-7xl">
              {{ artist.name }}
            </h1>
            <div v-if="artist.platforms.length" class="flex flex-wrap gap-3 md:gap-3">
              <LazyCbExternalLink
                v-for="link in artist.platforms"
                :key="link"
                :href="link"
              />
            </div>
            <div v-if="artist.socials.length" class="flex flex-wrap gap-3 md:gap-3">
              <LazyCbExternalLink
                v-for="link in artist.socials"
                :key="link"
                :href="link"
              />
            </div>
            <div v-if="isAdminStore">
              <NuxtLink
                :to="editLink"
                class="bg-secondary px-2 py-1 text-xs font-semibold uppercase"
              >
                Edit Artist
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto space-y-8 p-5">
      <p v-if="artist.description" class="whitespace-pre-line">
        {{ artist.description }}
      </p>
      <div v-if="members?.length">
        <CardDefault name="Members" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist
              v-for="soloMember in members"
              :key="`artistMembers_`+soloMember.id"
              :id="soloMember.id"
              :image="soloMember.image"
              :name="soloMember.name"
            />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="artist.releases?.length">
        <CardDefault name="Releases" class="space-y-3">
          <transition-group
            name="list-complete"
            tag="div"
            class="flex flex-wrap justify-between gap-3 lg:justify-start"
          >
            <LazyCardRelease
              v-for="release in artist.releases"
              :key="`artistRelease_`+release.id"
              :id="release.id"
              :image="release.image"
              :date="release.date"
              :name="release.name"
              :type="release.type"
              :artistsId="release.artistsId"
              :artistsName="release.artistsName"
              :displayDate="true"
              :yearReleased="release.year"
            />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="subUnitMembers?.length">
        <CardDefault name="Subunit" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist
              v-for="groupMember in subUnitMembers"
              :key="`artistSubunit_`+groupMember.id"
              :id="groupMember.id"
              :image="groupMember.image"
              :name="groupMember.name"
            />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="artist.groups?.length">
        <CardDefault name="Group" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist
              v-for="group in artist.groups"
              :key="`artistGroup_`+group.id"
              :id="group.id"
              :image="group.image"
              :name="group.name"
            />
          </transition-group>
        </CardDefault>
      </div>
      <div v-if="artist.news?.length">
        <CardDefault name="Comeback Reported">
          <transition-group
            name="list-complete"
            tag="div"
            class="grid grid-cols-1 gap-2 py-3 md:grid-cols-2 xl:grid-cols-3"
          >
            <LazyCardNews
              v-for="news in artist.news"
              :key="`comeback_`+news.artist.id+`_`+news.date"
              :message="news.message"
              :date="news.date"
              :artist="news.artist"
            />
          </transition-group>
        </CardDefault>
      </div>
    </section>
  </div>
</template>
