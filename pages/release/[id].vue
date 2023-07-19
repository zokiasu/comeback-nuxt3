<script setup>
const title = ref('Release Page')
const description = ref('Release')
const release = ref(null)

onMounted(async () => {
  const route = useRoute()
  release.value = await fetchReleaseById(route.params.id)
  title.value = release.value.name + ' by ' + release.value.artistsName
  description.value = release.value.name + ' by ' + release.value.artistsName
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
  <div v-if="release" class="min-h-[calc(100vh-60px)] container mx-auto w-full p-5 lg:flex lg:items-center">
    <div class="mx-auto w-fit space-y-5">
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold">{{ release.name }}</h1>
        <div class="flex gap-2">
          <p>{{ release.type }} -</p>
          <nuxt-link :to="`/artist/${release.artistsId}`">
            <h2 class="hover-underline-animation">
              {{ release.artistsName }}
            </h2>
          </nuxt-link>
        </div>
        <div v-if="release.platforms" class="flex flex-wrap gap-3">
          <a v-for="(platform, index) in release.platforms" :key="platform + '_' + index" :href="platform"
            target="_blank">
            <icon-youtube-music class="h-6 w-6" />
          </a>
        </div>
      </div>
      <div class="flex w-fit flex-col gap-10 lg:flex-row">
        <div class="mx-auto h-fit w-fit">
          <nuxt-img :src="release.image" class="h-1/3 rounded-md bg-gray-300 shadow-2xl shadow-quinary" />
        </div>
        <div class="overflow-hidden pr-5 pb-2 lg:h-[34rem] lg:w-[30rem]">
          <ul class="space-y-5">
            <a v-for="music in release.musics.slice().reverse()" :key="music.id"
              :href="`https://youtu.be/${music.videoId}`" target="_blank" class="flex items-center justify-between gap-5">
              <h3 class="font-semibold text-xl">{{ music.name }}</h3>
              <a :href="`https://youtu.be/${music.videoId}`" target="_blank">
                <icon-youtube class="h-8 w-8" />
              </a>
            </a>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>