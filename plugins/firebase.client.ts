import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    databaseURL: config.public.FIREBASE_DATABASE_URL,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGIN_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
    measurementId: config.public.FIREBASE_MEASUREMENT_ID,
  }
  

  nuxtApp.hook('app:beforeMount', () => {
    const app = initializeApp(firebaseConfig)
    const analytics = getAnalytics(app)

    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const database = getDatabase(app)

    nuxtApp.provide('auth', auth)
    nuxtApp.provide('firestore', firestore)
    nuxtApp.provide('analytics', analytics)
    nuxtApp.provide('database', database)
  })
})
