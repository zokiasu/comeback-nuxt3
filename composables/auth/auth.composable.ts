import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';

export const useAuth = () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const { $auth: auth } = useNuxtApp();
  const { setUserData, setIsAdmin, userDataStore } = useUserStore();

  const loginWithGoogle = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user.value = result.user;
      if (user.value != null) {
        await getDatabaseUser(user.value);
      }
      console.log('userDataStore', userDataStore);
    } catch (err) {
      console.error(err);
      error.value = err;
    } finally {
      isLoading.value = false;
      if (user.value != null) {
        const redirectUrl = router.currentRoute.value.query.redirect as string | '/';
        router.push(redirectUrl);
      }
    }
  };

  const getDatabaseUser = async (user: any) => {
    console.log('getDatabaseUser', user)
    try {
      const uid = user.uid;
      const db = getFirestore();
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log('userSnap', userSnap.data());
        const userData = userSnap.data();
        setUserData(userData);
        setIsAdmin(userData.role === 'ADMIN');
      } else {
        await createDatabaseUser(user);
      }
    } catch (error) {
      console.error('Error fetching database user:', error);
    }
  };

  const createDatabaseUser = async (user: any) => {
    console.log('createDatabaseUser', user)
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const today = new Date();
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
      });

      setUserData({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'USER',
      });
    } catch (error) {
      console.error('Error creating database user:', error);
    }
  };

  return {
    isLoading,
    user,
    error,
    loginWithGoogle,
  };
};
