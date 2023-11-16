<script setup lang="ts">
import * as Mdl from '@kouts/vue-modal'

const { Modal } = Mdl
const showModal = ref(false)
const sendNewStreamingPlatform = ref(false)
const newStreamingPlatform = ref({
  name: '',
  link: '',
})

import { type Release } from '@/types/release'
import { type Artist } from '@/types/artist'
import { useUserStore } from '@/stores/user'
const { isAdminStore } = useUserStore()

const title = ref('Release Page')
const description = ref('Release')
const { getReleaseByArtistId, updateRelease } = useFirebaseFunction()

const release = ref<Release>({} as Release)
const artistRelease = ref<Release[]>([] as Release[])
const artist = ref<Artist>({} as Artist)
const imageLoaded = ref(false)

const createNewPlatformStreaming = async () => {
  sendNewStreamingPlatform.value = true
  const tmp = [...release.value.platformList]
  tmp.push(newStreamingPlatform.value)
  await updateRelease(release.value.id, {
    platformList: tmp,
  })
  sendNewStreamingPlatform.value = false
  showModal.value = false
  newStreamingPlatform.value = {
    name: '',
    link: '',
  }
}

onMounted(async () => {
  const route = useRoute()
  release.value = (await fetchReleaseById(route.params.id as string)) as Release
  artist.value = (await fetchArtistLimitedInfoById(release.value.artistsId)) as Artist
  artistRelease.value = (await getReleaseByArtistId(release.value.artistsId))
    .sort((a, b) => b.date - a.date)
    .filter((rel) => rel.id !== release.value.id)
    .slice(0, 8) as Release[]
  console.log('artistRelease', artistRelease.value)
  console.log('release', release.value)
  console.log('artist', artist.value)
  title.value = release.value.name + ' by ' + release.value.artistsName
  description.value = release.value.name + ' by ' + release.value.artistsName
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
    <!--  Header Release -->
    <section class="relative h-fit">
      <!-- Header Image -->
      <div class="relative h-fit min-h-[20rem] lg:max-h-[30rem] lg:min-h-[30rem]">
        <div
          class="absolute inset-0 min-h-[20rem] w-full transition-all duration-700 ease-in-out lg:max-h-[30rem] lg:min-h-[30rem]"
          :class="imageLoaded ? 'bg-black opacity-30' : ' bg-primary opacity-100'"
        />
        <NuxtImg
          v-if="release.image"
          format="webp"
          preload
          :src="release.image"
          :alt="release.name"
          @load="imageLoaded = true"
          class="max-h-[20rem] min-h-[20rem] w-full object-cover lg:max-h-[30rem] lg:min-h-[30rem]"
        />
      </div>
      <!-- Header Data-->
      <div
        class="z-10 flex flex-col justify-end space-y-3 p-5 transition-all duration-300 ease-in-out md:absolute md:inset-0 md:min-h-full md:justify-center md:bg-secondary/50"
      >
        <div class="container mx-auto flex items-center gap-5 space-y-2.5 lg:items-end">
          <NuxtImg
            v-if="release.image"
            format="webp"
            preload
            :alt="release.name"
            :src="release.image"
            class="hidden aspect-square max-w-[12rem] rounded bg-primary md:block lg:max-w-[20rem]"
          />
          <SkeletonDefault
            v-else
            class="hidden aspect-square min-w-[12rem] max-w-[12rem] rounded md:block lg:min-w-[20rem] lg:max-w-[20rem]"
          />
          <div class="mt-auto space-y-3">
            <!-- Data Fetched -->
            <div v-if="release.name" class="space-y-2">
              <h1 class="text-2xl font-black lg:text-5xl 2xl:text-7xl">
                {{ release.name }}
              </h1>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/artist/${artist.id}`"
                  class="flex items-center gap-2 rounded-full transition-all duration-300 ease-in-out hover:bg-secondary hover:px-3 hover:py-0.5"
                >
                  <NuxtImg
                    v-if="artist.image"
                    format="webp"
                    preload
                    :src="artist.image"
                    :alt="artist.name"
                    class="h-3 w-3 rounded-full"
                  />
                  <p class="text-sm font-semibold">
                    {{ artist.name }}
                  </p>
                </NuxtLink>
                <p>-</p>
                <p>{{ release.type }}</p>
                <p>-</p>
                <p>{{ release.year }}</p>
              </div>
              <!-- <div class="space-y-2 text-xs">
                <p>1, 054, 258, 031 streams on Youtube Music</p>
                <p>1, 054, 258, 031 streams on Youtube Music</p>
                <p>1, 054, 258, 031 streams on Youtube Music</p>
              </div> -->
            </div>
            <!-- Skeleton -->
            <div v-else class="space-y-2.5">
              <SkeletonDefault class="h-5 w-40 rounded-full" />
              <div class="flex gap-2">
                <SkeletonDefault class="h-3 w-14 rounded" />
                <SkeletonDefault class="h-3 w-14 rounded" />
                <SkeletonDefault class="h-3 w-14 rounded" />
              </div>
              <SkeletonDefault class="h-3 w-60 rounded-full" />
              <SkeletonDefault class="h-3 w-60 rounded-full" />
              <SkeletonDefault class="h-3 w-60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto space-y-12 p-5 py-5 lg:px-0">
      <!-- Skeleton -->
      <section v-if="!release.name" class="space-y-2">
        <SkeletonDefault class="h-3 w-3/4 rounded-full" />
        <SkeletonDefault class="h-3 w-full rounded-full" />
        <SkeletonDefault class="h-3 w-full rounded-full" />
        <SkeletonDefault class="h-3 w-3/4 rounded-full" />
        <SkeletonDefault class="h-3 w-2/4 rounded-full" />
      </section>
      <!-- Platforms -->
      <section v-if="release.platformList?.length" class="space-y-2">
        <p class="font-black">Streaming Platforms</p>
        <div class="flex gap-2">
          <ComebackExternalLink
            v-for="social in release.platformList"
            :key="social.name"
            :name="social.name"
            :link="social.link"
          />
          <button
            v-if="isAdminStore"
            @click="showModal = true"
            class="flex items-center gap-2 rounded bg-quaternary px-3.5 py-2.5 text-sm hover:bg-quinary"
          >
            <IconPlus class="h-5 w-5" />
            <p>Add Streaming Platform</p>
          </button>
        </div>
      </section>
      <!-- Musics -->
      <section v-if="release.musics?.length" class="space-y-2">
        <p class="font-black">
          Tracks
          <span class="font-mono">({{ release.musics?.length }})</span>
        </p>
        <div class="space-y-2">
          <MusicDisplay
            v-for="song in release.musics"
            :key="song.videoId"
            :artistId="release.artistsId"
            :artistName="release.artistsName"
            :artistImage="artist.image"
            :musicId="song.videoId"
            :musicName="song.name"
            :musicImage="song.thumbnails[2].url"
            :duration="song.duration.toString()"
            class="w-full bg-quinary"
          />
        </div>
      </section>
      <!-- Release -->
      <section v-if="artistRelease.length" class="space-y-2">
        <p class="font-black">Other releases by {{ release.artistsName }}</p>
        <section
          class="remove-scrollbar flex gap-5 overflow-hidden overflow-x-scroll scroll-smooth px-5 md:px-0 lg:justify-between lg:gap-2"
        >
          <LazyCardRelease
            v-for="artRelease in artistRelease"
            :key="`artistRelease_` + artRelease.id"
            :id="artRelease.id"
            :image="artRelease.image"
            :date="artRelease.date"
            :name="artRelease.name"
            :type="artRelease.type"
            :artistsId="artRelease.artistsId"
            :artistsName="artRelease.artistsName"
            :displayDate="true"
            :yearReleased="artRelease.year"
          />
        </section>
      </section>
    </section>
    <Modal
      v-model="showModal"
      title="Add a Streaming Platforms"
      wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <div class="space-y-3">
        <CbInput v-model="newStreamingPlatform.name" label="Name" />
        <CbInput v-model="newStreamingPlatform.link" label="Link" />
        <button
          @click="createNewPlatformStreaming"
          :disabled="sendNewStreamingPlatform"
          class="w-full rounded bg-primary py-2 font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
        >
          <p v-if="sendNewStreamingPlatform">Sending...</p>
          <p v-else>Send News</p>
        </button>
      </div>
    </Modal>
  </div>
</template>
