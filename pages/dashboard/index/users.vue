<script setup>
const user = ref(null)
const userData = ref(null)
const isLogin = ref(null)

onMounted(async () => {
  isLogin.value = useUser().isLogin.value

  user.value = useUser().firebaseUser.value

  userData.value = await useUser().getDatabaseUser()
})
</script>

<template>
  <div>
    <pre>{{ user }}</pre>
  </div>
</template>