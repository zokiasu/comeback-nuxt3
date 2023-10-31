<script setup>
import { useUserStore } from './stores/user'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const { $auth } = useNuxtApp()
onMounted(() => {
  const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin } = useUserStore()

  $auth.onAuthStateChanged((userState) => {
    if (userState) {
      setFirebaseUser(userState)
      setIsLogin(true)
      getDatabaseUser(userState.uid)
    } else {
      setFirebaseUser(null)
      setIsLogin(false)
      setUserData(null)
      setIsAdmin(false)
    }
  })

  const getDatabaseUser = async (uid) => {
    const db = getFirestore()
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const user = userSnap.data()
      setUserData(user)
      setIsAdmin(user?.role ? true : false)
    } else {
      console.log('No such document!')
    }
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
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
