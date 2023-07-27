import { Modal } from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'

export default defineNuxtPlugin(nuxtApp => {
  const Mdl = Modal
  nuxtApp.vueApp.use(Mdl);
})