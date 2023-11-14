<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Artist } from '@/types/artist'
const { isAdminStore } = useUserStore()

const title = ref('Artist Page')
const description = ref('Artist')
const route = useRoute()
const artist = ref<Artist>({} as Artist)
const imageBackground = ref('')
const editLink = ref('/artist/edit/' + route.params.id)
const imageBackLoaded = ref(false)
const isFetchingArtist = ref(true)

onMounted(async () => {
  try {
    artist.value = (await fetchArtistFullInfoById(route.params.id as any)) as Artist
    imageBackground.value = artist.value.image
    title.value = artist.value.name
    description.value = artist.value.description
  } finally {
    isFetchingArtist.value = false
  }
})

// computed members
const members = computed(() => {
  return artist.value?.members?.filter((member) => member.type === 'SOLO') || []
})
// computed subUnitMembers
const subUnitMembers = computed(() => {
  return artist.value?.members?.filter((member) => member.type === 'GROUP') || []
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
  <div>
    <section
      class="background-top relative overflow-hidden bg-cover bg-no-repeat h-[30vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
    >
      <NuxtImg
        v-if="imageBackground"
        :src="imageBackground"
        :alt="artist.name + '_back'"
        format="webp"
        loading="lazy"
        @load="imageBackLoaded = true"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 flex items-end p-5 transition-all duration-500 ease-in-out lg:p-10 xl:p-14 xl:px-32"
        :class="imageBackLoaded ? 'bg-secondary/60' : 'bg-quinary'"
      >
        <div class="space-y-5">
          <h1 v-if="artist.name" class="text-3xl py-3 font-semibold md:text-6xl lg:text-7xl">
            {{ artist.name }}
          </h1>
          <SkeletonDefault v-if="isFetchingArtist" class="h-14 w-80 rounded" />
          <div v-if="artist.platformList" class="flex flex-wrap gap-3 md:gap-3">
            <LazyComebackExternalLink
              v-for="platform in artist.platformList"
              :key="platform.link"
              :name="platform.name"
              :link="platform.link"
            />
          </div>
          <div v-if="isFetchingArtist" class="flex gap-2">
            <SkeletonDefault
              v-for="i in 3"
              :key="`skeleton_platforms_` + i"
              class="h-6 w-20 rounded"
            />
          </div>
          <div v-if="artist.socialList?.length" class="flex flex-wrap gap-3 md:gap-3">
            <LazyComebackExternalLink
              v-for="social in artist.socialList"
              :key="social.link"
              :name="social.name"
              :link="social.link"
            />
          </div>
          <div v-if="isFetchingArtist" class="flex gap-2">
            <SkeletonDefault
              v-for="i in 3"
              :key="`skeleton_socials_` + i"
              class="h-6 w-20 rounded"
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
    </section>

    <section class="container mx-auto space-y-8 p-5 py-8 lg:space-y-14 lg:py-14">
      <div v-if="!artist.name" class="space-y-2">
        <SkeletonDefault class="h-5 w-3/4 rounded" />
        <SkeletonDefault class="h-5 w-2/4 rounded" />
        <SkeletonDefault class="h-5 w-2/6 rounded" />
        <SkeletonDefault class="h-5 w-2/5 rounded" />
      </div>
      <p v-if="artist.description" class="max-w-6xl whitespace-pre-line leading-8">
        {{ artist.description }}
      </p>
      <div v-if="members?.length">
        <CardDefault name="Members" class="space-y-3">
          <transition-group name="list-complete" tag="div" class="flex flex-wrap gap-3">
            <LazyCardArtist
              v-for="soloMember in members"
              :key="`artistMembers_` + soloMember.id"
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
              :key="`artistRelease_` + release.id"
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
              :key="`artistSubunit_` + groupMember.id"
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
              :key="`artistGroup_` + group.id"
              :id="group.id"
              :image="group.image"
              :name="group.name"
            />
          </transition-group>
        </CardDefault>
      </div>
    </section>
  </div>
</template>
