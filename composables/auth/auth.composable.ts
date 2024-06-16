import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref } from 'vue'

export const useAuth = () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const router = useRouter();

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
      if(user.value != null) {
        // Rediriger l'utilisateur vers une autre page
        router.push('/');
      }
    }
  }

  const loginWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    // Vous pouvez également définir des paramètres supplémentaires ici, par exemple :
    // provider.setCustomParameters({ prompt: 'select_account' });
    isLoading.value = true
    error.value = null

    try {
      const result = await signInWithPopup(auth, provider);
      // Traitez le résultat ici (récupérez le token, l'utilisateur, etc.)
      user.value = result.user
    } catch (error) {
      console.error(error);
      error.value = err
    } finally {
      isLoading.value = false
      if(user.value != null) {
        // Rediriger l'utilisateur vers une autre page
        router.push('/desired-route');
      }
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
