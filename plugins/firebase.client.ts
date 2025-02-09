import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGIN_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
    measurementId: config.public.FIREBASE_MEASUREMENT_ID,
    databaseURL: config.public.FIREBASE_DATABASE_URL,
  }

  try {
    const app = initializeApp(firebaseConfig)
    let analytics = null
    let auth = null
    let firestore = null
    let database = null

    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.warn('Analytics not available:', error)
    }

    try {
      auth = getAuth(app)
    } catch (error) {
      console.error('Auth initialization failed:', error)
    }

    try {
      firestore = getFirestore(app)
      // Enable offline persistence
      if (firestore) {
        try {
          await enableMultiTabIndexedDbPersistence(firestore)
        } catch (err: any) {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.')
          } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support persistence.')
          }
        }
      }
    } catch (error) {
      console.error('Firestore initialization failed:', error)
    }

    try {
      database = getDatabase(app)
    } catch (error) {
      console.error('Realtime Database initialization failed:', error)
    }

    // Provide services only if they were successfully initialized
    if (auth) nuxtApp.provide('auth', auth)
    if (firestore) nuxtApp.provide('firestore', firestore)
    if (analytics) nuxtApp.provide('analytics', analytics)
    if (database) nuxtApp.provide('database', database)

  } catch (error) {
    console.error('Firebase initialization failed:', error)
    // Ne pas throw d'erreur en production, mais retourner silencieusement
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Failed to initialize Firebase. Please try again later.')
    }
  }
})
