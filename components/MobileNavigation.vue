<script setup>
import * as Mdl from '@kouts/vue-modal'

const { Modal } = Mdl
const showModal = ref(false)
const showModalAlgolia = ref(false)
const isPlayingVideo = useIsPlayingVideo()

const { artistFetch, isAdmin, isLogin } = defineProps([
  'artistFetch',
  'isAdmin',
  'isLogin',
])
</script>

<template>
  <div
    class="fixed w-full px-5 transition-all duration-300 ease-in-out"
    :class="isPlayingVideo ? 'bottom-20' : 'bottom-5'"
  >
    <div
      class="flex w-full justify-between divide-x divide-zinc-700 overflow-hidden rounded-full border border-zinc-700 bg-secondary shadow shadow-zinc-700 drop-shadow-sm"
    >
      <NuxtLink
        :to="`/`"
        class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
      >
        <IconHome class="mx-auto h-5 w-5" />
      </NuxtLink>
      <NuxtLink
        :to="`/calendar`"
        class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
      >
        <IconCalendar class="mx-auto h-5 w-5" />
      </NuxtLink>
      <button
        @click="showModalAlgolia = true"
        class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
      >
        <IconSearch class="mx-auto h-5 w-5" />
      </button>
      <NuxtLink
        v-if="isAdmin"
        :to="`/dashboard/artist`"
        class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
      >
        <IconEdit class="mx-auto h-5 w-5" />
      </NuxtLink>
      <NuxtLink
        v-if="!isLogin"
        :to="`/authentification`"
        class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
      >
        <IconAccount class="mx-auto h-5 w-5" />
      </NuxtLink>
      <button
        v-else
        @click="showModal = true"
        class="flex w-full items-center justify-center bg-primary/20 py-2 transition-all duration-500 ease-in-out"
      >
        <IconComeback class="mx-auto h-5 w-5" />
      </button>
    </div>
    <Modal
      v-model="showModal"
      title="Add a News"
      wrapper-class="animate__animated modal-wrapper"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__fadeInDown`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <NewsCreation :artistList="artistFetch" @close-modal="showModal = false" />
    </Modal>
    <Modal
      v-model="showModalAlgolia"
      title="Search Artist"
      wrapper-class="modal-wrapper"
      :modal-class="`modal-lg`"
      :modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
      :in-class="`animate__bounceIn`"
      :out-class="`animate__bounceOut`"
      bg-class="animate__animated"
      :bg-in-class="`animate__fadeInUp`"
      :bg-out-class="`animate__fadeOutDown`"
    >
      <Algolia ref="algolia" @close-modal="showModalAlgolia = false" />
    </Modal>
  </div>
</template>
