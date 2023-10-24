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
      STRAPI_URL: process.env.STRAPI_URL,
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-vuefire',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  build: {
    // vue-toastification - old commonjs module
    transpile: [
      'vue-toastification',
      '@vuepic/vue-datepicker',
    ],
  },

  vuefire: {
    auth: true,
    config: {
      apiKey:
        process.env.FIREBASE_API_KEY,
      authDomain:
        process.env
          .FIREBASE_AUTH_DOMAIN,
      projectId:
        process.env.FIREBASE_PROJECT_ID,
      storageBucket:
        process.env
          .FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        process.env
          .FIREBASE_MESSAGIN_SENDER_ID,
      appId:
        process.env.FIREBASE_APP_ID,
      measurementId:
        process.env
          .FIREBASE_MEASUREMENT_ID,
    },
  },

  pinia: {
    autoImports: ['defineStore'],
  },

  tailwindcss: {
    cssPath:
      '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
})