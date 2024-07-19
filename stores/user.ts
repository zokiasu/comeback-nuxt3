// store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

export const useUserStore = defineStore('userStore', () => {
  const firebaseUserStore = ref(null)
  const isLoginStore = ref(false)
  const isAdminStore = ref(false)
  const userDataStore = ref(null)

  const setUserData = (user: any) => {
    userDataStore.value = user
  }

  const setFirebaseUser = (user: any) => {
    firebaseUserStore.value = user
  }

  const setIsLogin = (isLogin: boolean) => {
    isLoginStore.value = isLogin
  }

  const setIsAdmin = (isAdmin: boolean) => {
    isAdminStore.value = isAdmin
  }

  async function checkUserAuthState() {
    const { $auth } = useNuxtApp()
    return new Promise<void>((resolve) => {
        const unsubscribe = $auth.onAuthStateChanged((user: any) => {
            if (user) {
              getDatabaseUser(user)
            }
            unsubscribe();
            resolve();
        });
    });
  }

  const getDatabaseUser = async (user: any) => {
    const uid = user.uid
    const db = getFirestore()
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const userData = userSnap.data()
      setUserData(userData)
      setIsAdmin(userData.role === 'ADMIN')
    }
  }

  return {
    firebaseUserStore,
    userDataStore,
    isLoginStore,
    isAdminStore,
    setUserData,
    setFirebaseUser,
    setIsLogin,
    setIsAdmin,
    checkUserAuthState
  }
}, {
  persist: true,
})
