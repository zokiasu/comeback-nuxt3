<script setup>
  import { useUserStore } from './stores/user'
  import { doc, setDoc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'

  const { $auth } = useNuxtApp()
  const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin } = useUserStore()

  onMounted(() => {
    setUserData(null)
    $auth.onAuthStateChanged((userState) => {
      if (userState) {
        setFirebaseUser(userState)
        setIsLogin(true)
        getDatabaseUser(userState)
      } else {
        setFirebaseUser(null)
        setIsLogin(false)
        setUserData(null)
        setIsAdmin(false)
      }
    })

    const getDatabaseUser = async (user) => {
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

    const createDatabaseUser = async (user) => {
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
  })
</script>

<template>
  <NuxtLayout>
    <div>
      <NuxtLoadingIndicator color="#9E0102" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<style>
/* Page Transitions - 0.4s Slide/Fade */
.page-enter-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.page-enter {
  opacity: 0;
}

.page-leave-active {
  opacity: 0;
}
</style>
