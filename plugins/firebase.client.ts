// plugins/firebase.client.ts
import { defineNuxtPlugin } from '#app';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;

  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    databaseURL: config.FIREBASE_DATABASE_URL,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGIN_SENDER_ID,
    appId: config.FIREBASE_APP_ID,
    measurementId: config.FIREBASE_MEASUREMENT_ID,
  };

  // Vérifiez si l'application Firebase est déjà initialisée
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const auth = getAuth();
  const firestore = getFirestore();
  const analytics = getAnalytics();
  const database = getDatabase();

  nuxtApp.provide('auth', auth);
  nuxtApp.provide('firestore', firestore);
  nuxtApp.provide('analytics', analytics);
  nuxtApp.provide('database', database);
});
