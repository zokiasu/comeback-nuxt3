<template>
  <div class="bg-quinary rounded text-left flex-1 min-w-[300px]">
      <div class="bg-secondary relative text-center px-2 py-1 font-bold rounded-t">
        <p @click="showModal = true" class="cursor-pointer">{{ ranking.name || 'Untitled' }}</p>
        <div v-if="isProfile" class="absolute right-2 top-2 flex gap-2">
          <NuxtLink :to="`/ranking/edit/${ranking.id}`">
            <IconEdit class="w-4 h-4 hover:text-primary" />
          </NuxtLink>
          <IconDelete @click="deleteRanking" class="w-4 h-4 hover:text-primary cursor-pointer" />
        </div>
      </div>
      <div @click="showModal = true" v-for="(music, index) in ranking.musics.slice(0, 3)" class="space-y-2 p-2 cursor-pointer">
          <p class="truncate relative group">
            <span>#{{ index + 1 }} - {{ music.artists[0].name }} - {{ music.name }}</span>
          </p>
      </div>
      <p v-if="ranking.musics.length > 3" class="p-2 pt-0 italic text-xs text-tertiary/50 text-start">And {{ ranking.musics.length - 3 }} more songs, click to see the full ranking</p>
  </div>
  <Modal
    v-model="showModal"
    :title="ranking.name || 'Untitled'"
    wrapper-class="animate__animated modal-wrapper"
    :modal-class="`modal modal-xl`"
    :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
    :in-class="`animate__fadeInDown`"
    :out-class="`animate__bounceOut`"
    bg-class="animate__animated"
    :bg-in-class="`animate__fadeInUp`"
    :bg-out-class="`animate__fadeOutDown`"
  >
    <div class="grid grid-rows-10 gap-2" :class="ranking.musics.length > 10 ? 'grid-flow-col overflow-x-auto pb-2 remove-scrollbar' : ''">
      <div v-for="(song, index) in ranking.musics" :key="song.videoId" class="flex items-center gap-2 min-w-80 xl:min-w-96">
        <p class="bg-quinary rounded aspect-square h-full flex items-center justify-center">#{{ index + 1 }}</p>
        <MusicDisplay
          :artistId="song.artists[0].artistId"
          :artistName="song.artists[0].name"
          :musicId="song.videoId"
          :musicName="song.name"
          :musicImage="song.thumbnails[2].url"
          :duration="song?.duration?.toString() || '0'"
          class="w-full bg-quinary"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
  import * as Mdl from '@kouts/vue-modal'
  import '@kouts/vue-modal/dist/vue-modal.css'

  defineProps<{
    ranking: any,
    isProfile: boolean
  }>()

  const { Modal } = Mdl
  const showModal = ref(false)

  const emit = defineEmits(['delete'])

  const deleteRanking = () => {
    emit('delete')
  }
</script>

<style>
.modal {
  min-width: 300px;
}
@media (min-width: 480px) {
  .modal.modal-sm {
    max-width: 300px;
  }
}
@media (min-width: 992px) {
  .modal.modal-lg,
  .modal.modal-xl {
    max-width: 800px;
  }
}
@media (min-width: 1200px) {
  .modal.modal-xl {
    max-width: 1140px;
  }
}
</style>
