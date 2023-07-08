<template>
  <NuxtLayout>
    <Navigation />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// const router = useRouter()
// const route = useRoute()
// const user = useCurrentUser()

// // we don't need this watcher on server
// onMounted(() => {
//   watch(user, (user, prevUser) => {
//     if (prevUser && !user) {
//       // user logged out
//       console.log('user exist')
//       router.push('/login')
//     } else if (user && typeof route.query.redirect === 'string') {
//       // user logged in
//       console.log('user dont exist')
//       router.push(route.query.redirect)
//     }
//   })
// })
</script>

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
