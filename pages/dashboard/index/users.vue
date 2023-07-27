<script setup>
const user = ref(null)
const userData = ref(null)
const isLogin = ref(null)

onMounted(async () => {
  isLogin.value = useUser().isLogin.value
  console.log('isLogin', isLogin.value)

  user.value = useUser().firebaseUser.value
  console.log('user', user.value)

  userData.value = await useUser().getDatabaseUser()
  console.log('userData', userData.value)
})
</script>

<template>
  <div>
    <pre>{{ user }}</pre>
  </div>
</template>