import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
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
  // const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const { getDatabaseUser, isLogin, isAdmin } = useUser();
  const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin } = useUserStore()
  
  auth.onAuthStateChanged((userState) => {
    if (userState) {
      setFirebaseUser(userState)
      setIsLogin(true)
      isLogin.value = true
      getDatabaseUser().then((result) => {
        if (result) {
          setUserData(result)
          setIsAdmin(result.role ? true : false)
          isAdmin.value = result.role ? true : false
        }
      }).catch(()=> {
        console.log('getDatabaseUser doesn\'t work')
      })
    } else {
      setFirebaseUser(null)
      setIsLogin(false)
      setUserData(null)
      setIsAdmin(false)
      isLogin.value = false
      isAdmin.value = false
    }
  });

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('firestore', firestore)
  nuxtApp.provide('firestore', firestore)
});