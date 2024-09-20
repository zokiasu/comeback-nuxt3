import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/stores/user';

export const signUpWithEAndP = async (email: string, password: string) => {
  const { $auth } = useNuxtApp()

  const credentials = await createUserWithEmailAndPassword($auth, email, password).catch(
    (error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(error)
    },
  )
  return credentials
}

export const signInWithEAndP = async (email: string, password: string) => {
  const { $auth } = useNuxtApp()

  const credentials = await signInWithEmailAndPassword($auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user
      const idToken = await user.getIdToken()

      // Envoyer le token au serveur
      await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      return userCredential
    })
    .catch((error) => {
      console.error('Erreur lors de la connexion:', error)
    })

  return credentials
}

export const signOutApp = async () => {
  const { $auth } = useNuxtApp()
  const { setUserData, setIsAdmin } = useUserStore()
  setUserData(null)
  setIsAdmin(false)

  // Appeler l'API de déconnexion pour supprimer le cookie
  await fetch('/api/logout', {
    method: 'POST',
  })

  const result = await $auth.signOut()
  return result
}

