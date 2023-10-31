export const useUserStore = defineStore(
  'userStore',
  () => {
    const userStore = useState<any>('userStore', () => null)
    const authStore = useState<any>('authStore', () => null)
    const firebaseUserStore = useState<any>('firebaseUserStore', () => null)

    const isLoginStore = useState<boolean>('isLoginStore', () => false)
    const isAdminStore = useState<boolean>('isAdminStore', () => false)
    const userDataStore = useState<any>('userDataStore', () => null)

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
    }
  },
  {
    persist: true,
  },
)
