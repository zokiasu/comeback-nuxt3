// store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {

  const userStore = ref(null)
  const authStore = ref(null)
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

  // Dans le store utilisateur
  async function checkUserAuthState() {
    const { $auth } = useNuxtApp()
    return new Promise<void>((resolve) => {
        const unsubscribe = $auth.onAuthStateChanged((user: any) => {
            if (user) {
              userDataStore.value = user;
            } else {
              userDataStore.value = null;
            }
            unsubscribe();
            resolve();
        });
    });
  }


  return {
    userStore,
    authStore,
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
