<script setup>
const userIsLogin = useUser().isUserLogin()
const userData = useUser().useUserData()
</script>

<template>
  <div>
    News Dashboard
    <pre>
      {{ userIsLogin }}
      {{ userData }}
    </pre>
  </div>
</template>