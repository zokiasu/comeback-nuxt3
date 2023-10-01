<script setup lang="ts">
import {
  Timestamp,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useToast } from 'vue-toastification'

const { $firestore: db } = useNuxtApp()
const toast = useToast()

const styleFetch = ref([] as any[])
const newStyle = ref('')

onMounted(async () => {
  onSnapshot(
    doc(db as any, 'general', 'data'),
    (doc) => {
      styleFetch.value =
        doc?.data().styles
      styleFetch.value.sort((a, b) => {
        return a.name.localeCompare(
          b.name,
        )
      })
    },
  )
})

const createStyle = async () => {
  await setDoc(
    doc(db as any, 'general', 'data'),
    {
      styles: [
        {
          created: Timestamp.now(),
          name: newStyle.value,
        },
        ...styleFetch.value,
      ],
    },
  ).then(() => {
    toast.success('Style added')
    newStyle.value = ''
  })
}
</script>

<template>
  <div class="space-y-5">
    <section
      id="input-new-search"
      class="flex w-full justify-start gap-2"
    >
      <input
        id="input"
        v-model="newStyle"
        type="text"
        placeholder="Add new style"
        class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-700 ease-in-out placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
      <button
        @click="createStyle"
        class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
      >
        Send
      </button>
    </section>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="style in styleFetch"
        :key="style.name"
        class="rounded bg-quaternary px-2.5 py-1"
      >
        {{ style.name }}
      </div>
    </div>
  </div>
</template>
