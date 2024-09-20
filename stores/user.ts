import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const firebaseUserStore = ref(null);
  const isLoginStore = ref(false);
  const isAdminStore = ref(false);
  const userDataStore = ref(null);

  const setUserData = (user: any) => {
    userDataStore.value = user;
    isAdminStore.value = user.role ? user.role === 'ADMIN' : false;
  };

  const setFirebaseUser = (user: any) => {
    firebaseUserStore.value = user;
  };

  const setIsLogin = (isLogin: boolean) => {
    isLoginStore.value = isLogin;
  };

  const setIsAdmin = (isAdmin: boolean) => {
    isAdminStore.value = isAdmin;
  };

  return {
    firebaseUserStore,
    userDataStore,
    isLoginStore,
    isAdminStore,
    setUserData,
    setFirebaseUser,
    setIsLogin,
    setIsAdmin,
  };
}, {
  persist: true,
});
