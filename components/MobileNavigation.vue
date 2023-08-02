<script setup>
import * as Mdl from '@kouts/vue-modal'

const { Modal } = Mdl
const showModal = ref(false)

const { artistFetch, isAdmin, isLogin } = defineProps(['artistFetch', 'isAdmin', 'isLogin'])
</script>

<template>
  <div class="fixed bottom-5 px-5 w-full">
    <div
      class="w-full flex justify-between divide-x divide-zinc-700 rounded-full bg-secondary drop-shadow-sm overflow-hidden border border-zinc-700 shadow shadow-zinc-700">
      <NuxtLink 
        :to="`/`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconHome class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        :to="`/calendar`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconCalendar class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        :to="`/artist`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconSearch class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        v-if="isAdmin"
        :to="`/dashboard/artist`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconEdit class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink
        v-if="!isLogin"
        :to="`/authentification`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconAccount class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <button v-else @click="showModal = true" class="flex items-center justify-center w-full py-2 bg-primary/20 transition-all ease-in-out duration-500">
        <IconComeback class="w-5 h-5 mx-auto" />
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
      <NewsCreation :artistList="artistFetch" @close-modal="showModal = false"/>
    </Modal>
  </div>
</template>