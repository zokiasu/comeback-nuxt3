import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";


export const useUserStore = defineStore('userStore', () => {

  const userStore = useState<any>('userStore', () => null);
  const authStore = useState<any>('authStore', () => null);
  const firebaseUserStore = useState<any>('firebaseUserStore', () => null);

  const isLoginStore = useState<boolean>('isLoginStore', () => false);
  const isAdminStore = useState<boolean>('isAdminStore', () => false);
  const userDataStore = useState<any>('userDataStore', () => null);
  
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

  const auth = getAuth();
  
  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      setFirebaseUser(user);
      setIsLogin(true);

      const userData = await getDatabaseUser(user.uid);
      if (userData) {
        setUserData(userData);
        setIsAdmin(userData.role ? true : false);
      }
    } else {
      setFirebaseUser(null);
      setIsLogin(false);
      setUserData(null);
      setIsAdmin(false);
    }
  });

  const getDatabaseUser = async (uid: string) => {
    const db = getFirestore();
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  };

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
    getDatabaseUser,
  }
}, {
  persist: true
})