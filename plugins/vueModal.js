// import * as mdl from '@kouts/vue-modal'
// import '@kouts/vue-modal/dist/vue-modal.css'

// export default defineNuxtPlugin((nuxtApp) => {
//   const { Modal } = mdl
//   nuxtApp.vueApp.use(Modal)
// })

import * as mdl from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Modal', mdl.Modal)
})
