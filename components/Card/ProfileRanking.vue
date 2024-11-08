<template>
  <div class="bg-quinary rounded text-left flex-1 min-w-[300px]">
      <div class="bg-secondary relative text-center px-2 py-1 font-bold rounded-t">
        <p @click="showModal = true" class="cursor-pointer">{{ ranking.name || 'Untitled' }}</p>
        <div v-if="isProfile" class="absolute right-2 top-2 flex gap-2">
          <NuxtLink :to="`/ranking/edit/${ranking.id}`">
            <IconEdit class="w-4 h-4 hover:text-primary" />
          </NuxtLink>
          <IconDelete class="w-4 h-4 hover:text-primary cursor-pointer" />
        </div>
      </div>
      <div @click="showModal = true" v-for="(music, index) in ranking.musics.slice(0, 3)" class="space-y-2 p-2 cursor-pointer">
          <p class="truncate relative group">
            <span>#{{ index + 1 }} - {{ music.artists[0].name }} - {{ music.name }}</span>
          </p>
      </div>
  </div>
  <Modal
    v-model="showModal"
    :title="ranking.name || 'Untitled'"
    wrapper-class="animate__animated modal-wrapper"
    :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
    :in-class="`animate__fadeInDown`"
    :out-class="`animate__bounceOut`"
    bg-class="animate__animated"
    :bg-in-class="`animate__fadeInUp`"
    :bg-out-class="`animate__fadeOutDown`"
  >
    <div class="space-y-2">
      <MusicDisplay
        v-for="song in ranking.musics"
        :key="song.videoId"
        :artistId="song.artists[0].artistId"
        :artistName="song.artists[0].name"
        :musicId="song.videoId"
        :musicName="song.name"
        :musicImage="song.thumbnails[2].url"
        :duration="song?.duration?.toString() || '0'"
        class="w-full bg-quinary"
      />
    </div>
  </Modal>
</template>

<script lang="ts" setup>
  import * as Mdl from '@kouts/vue-modal'

  defineProps<{
    ranking: any
    isProfile: boolean
  }>()

  const { Modal } = Mdl
  const showModal = ref(false)


</script>
