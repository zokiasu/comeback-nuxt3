import * as vdp from '@vuepic/vue-datepicker'
// import '@vuepic/vue-datepicker/dist/main.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueDatePicker', vdp.VueDatePicker)
})
