import * as vdp from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default defineNuxtPlugin(nuxtApp => {
  const { VueDatePicker } = vdp
  nuxtApp.vueApp.use(VueDatePicker);
})