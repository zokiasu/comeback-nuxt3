import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

export const useAuth = () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const router = useRouter();

  const { $auth: auth } = useNuxtApp()
  const { setUserData, setIsAdmin, userDataStore } = useUserStore()

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      if (user.value != null) {
        getDatabaseUser(user.value)
        console.log('loginWithGoogle userDataStore', userDataStore)
      }
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      isLoading.value = false
      if (user.value != null) {
        // Vérifier si un paramètre de redirection est présent dans l'URL
        const redirectUrl = router.currentRoute.value.query.redirect as string | undefined;
        // Rediriger vers l'URL spécifiée ou vers la page d'accueil par défaut
        router.push(redirectUrl || '/');
      }
    }
  }

  const getDatabaseUser = async (user: any) => {
    const uid = user.uid
    const db = getFirestore()
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const user = userSnap.data()
      setUserData(user)
      setIsAdmin(user.role == 'ADMIN' ? true : false)
    } else {
      console.log('No such document!')
      createDatabaseUser(user);
    }
  }

  const createDatabaseUser = async (user: any) => {
    const db = getFirestore()
    const userRef = doc(db, 'users', user.uid)
    const today = new Date();
    today.setDate(today.getDate());
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      role: 'USER',
      createdAt: todayTimestamp,
      updatedAt: todayTimestamp,
    })

    setUserData({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      role: 'user'
    })
  }

  return {
    isLoading,
    user,
    error,
    loginWithGoogle,
  }
}
