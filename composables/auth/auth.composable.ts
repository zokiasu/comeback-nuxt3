import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref } from 'vue'

export const useAuth = () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const { $auth: auth } = useNuxtApp()

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    // Vous pouvez également définir des paramètres supplémentaires ici, par exemple :
    // provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      // Traitez le résultat ici (récupérez le token, l'utilisateur, etc.)
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isLoading,
    user,
    error,
    loginWithGoogle,
    loginWithMicrosoft,
  }
}
