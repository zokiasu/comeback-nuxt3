<template>
  <NuxtLayout>
    <Navigation/>
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
