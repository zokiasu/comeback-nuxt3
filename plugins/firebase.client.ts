import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGIN_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
    measurementId: config.public.FIREBASE_MEASUREMENT_ID
  };
  const app = initializeApp(firebaseConfig);
  
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin } = useUserStore()
  
  auth.onAuthStateChanged((userState) => {
    if (userState) {
      setFirebaseUser(userState)
      setIsLogin(true)
      getDatabaseUser(userState.uid)
    } else {
      setFirebaseUser(null)
      setIsLogin(false)
      setUserData(null)
      setIsAdmin(false)
    }
  });

  const getDatabaseUser = async (uid: string) => {
    const db = getFirestore()
    const userRef = doc(db, "users", uid);
    onSnapshot(userRef, (querySnapshot) => {
      const user = querySnapshot.data();
      setUserData(user);
      setIsAdmin(user?.role ? true : false);
    });
  };

  nuxtApp.provide('auth', auth)
  nuxtApp.provide('firestore', firestore)
});