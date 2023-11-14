<script setup lang="ts">
import { type Release } from '@/types/release'
import { type Artist } from '@/types/artist'

const title = ref('Release Page')
const description = ref('Release')
const { getReleaseByArtistId } = useFirebaseFunction()

const release = ref<Release>({} as Release)
const artistRelease = ref<Release[]>([] as Release[])
const artist = ref<Artist>({} as Artist)
const imageLoaded = ref(false)

onMounted(async () => {
  const route = useRoute()
  release.value = (await fetchReleaseById(route.params.id as string)) as Release
  artist.value = (await fetchArtistLimitedInfoById(release.value.artistsId)) as Artist
  artistRelease.value = (await getReleaseByArtistId(release.value.artistsId)).sort((a,b) => b.date - a.date).filter((rel) => rel.id !== release.value.id).slice(0,8) as Release[]
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
            <!-- Buttons -->
            <!-- <div class="flex flex-wrap gap-2 text-xs">
              <NuxtLink
                :to="`/release/edit/` + release.id"
                class="w-20 bg-quaternary py-1 text-center hover:bg-quinary"
              >
                <p>Edit</p>
              </NuxtLink>
            </div> -->
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
        </div>
      </section>
      <!-- Musics -->
      <section v-if="release.musics?.length" class="space-y-2">
        <p class="font-black">Tracks</p>
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
        <p class="font-black">Other releases of {{ release.artistsName }}</p>
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
  </div>
</template>
