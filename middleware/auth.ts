import { useUserStore } from '@/stores/user'
import { doc, getDoc, getFirestore, Timestamp, setDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $auth } = useNuxtApp()
  const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin, firebaseUserStore } = useUserStore()

  // Fonction pour vérifier l'état de l'utilisateur
  const checkAuthState = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = $auth.onAuthStateChanged(async (userState: any) => {
        if (userState) {
          setFirebaseUser(userState)
          setIsLogin(true)
          await getDatabaseUser(userState)
          resolve(userState)
        } else {
          setFirebaseUser(null)
          setIsLogin(false)
          setUserData(null)
          setIsAdmin(false)
          resolve(null)
        }
        unsubscribe()
      }, error => {
        reject(error)
      })
    })
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
    } else {
      console.log('No such document!')
      await createDatabaseUser(user)
    }
  }

  const createDatabaseUser = async (user: any) => {
    const db = getFirestore()
    const userRef = doc(db, 'users', user.uid)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = Timestamp.fromDate(today)

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
      role: 'USER'
    })
  }

  try {
    const user = await checkAuthState()
    console.log('Middleware User:', user)
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!user) {
      return navigateTo({
        path: '/authentification',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'état de l\'utilisateur:', error)
    // En cas d'erreur, rediriger vers la page de connexion
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})
