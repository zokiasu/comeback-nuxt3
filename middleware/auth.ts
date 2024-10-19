import { useUserStore } from '@/stores/user'
import { doc, getDoc, getFirestore, Timestamp, setDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { userDataStore } = useUserStore()

  try {
    if(userDataStore === null) {
      // En cas d'erreur, rediriger vers la page de connexion
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
