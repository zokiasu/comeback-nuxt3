// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGIN_SENDER_ID: process.env.FIREBASE_MESSAGIN_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    },
  },

  plugins: [
    '~/plugins/firebase.client.ts',
    '~/plugins/toast.js',
    '~/plugins/VueDatePicker.js',
    '~/plugins/vueModal.js',
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    '@nuxtjs/algolia'
  ],

  algolia: {
    applicationId: process.env.ALGOLIA_APPLICATION_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME,
    useFetch: true,
    instantSearch: true,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  build: {
    // vue-toastification - old commonjs module
    transpile: ['vue-toastification', '@vuepic/vue-datepicker'],
  },

  pinia: {
    autoImports: ['defineStore'],
  },

  tailwindcss: {
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  }
})
