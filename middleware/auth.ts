import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#app';
import { useUserStore } from '@/stores/user';
import { getAuth } from 'firebase-admin/auth';
import { parseCookies } from 'h3';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  const { $adminAuth } = useNuxtApp();
  const event = useRequestEvent();

  try {
    const cookies = parseCookies(event);
    const idToken = cookies.authToken;

    if (!idToken) {
      throw new Error('No token found');
    }

    // Vérifier le token avec Firebase Admin SDK
    const decodedToken = await $adminAuth.verifyIdToken(idToken);

    // Récupérer les informations de l'utilisateur depuis Firebase
    const user = await $adminAuth.getUser(decodedToken.uid);

    // Mettre à jour le store utilisateur
    // userStore.setUserData({
    //   id: user.uid,
    //   email: user.email,
    //   name: user.displayName,
    //   photoURL: user.photoURL,
    //   role: user.customClaims?.role || 'USER',
    // });
    userStore.setIsLogin(true);
    // userStore.setIsAdmin(userStore.userDataStore.role === 'ADMIN');

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    // Rediriger vers la page de connexion
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
