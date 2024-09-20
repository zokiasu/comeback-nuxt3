import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Vérifiez si l'application Firebase Admin est déjà initialisée
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: config.public.FIREBASE_PROJECT_ID,
        clientEmail: config.FIREBASE_CLIENT_EMAIL,
        privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: config.public.FIREBASE_DATABASE_URL,
    });
  }

  const adminApp = getApp();
  const adminAuth = getAuth(adminApp);
  const adminFirestore = getFirestore(adminApp);
  const adminDatabase = getDatabase(adminApp);

  nuxtApp.provide('adminAuth', adminAuth);
  nuxtApp.provide('adminFirestore', adminFirestore);
  nuxtApp.provide('adminDatabase', adminDatabase);
});
