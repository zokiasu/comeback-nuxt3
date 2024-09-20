import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUserStore } from '@/stores/user';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.isLoginStore || !userStore.isAdminStore) {
    // Rediriger vers la page de connexion
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
