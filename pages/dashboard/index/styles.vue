<script setup>
import { useUserStore } from '@/stores/user'
const { firebaseUserStore, userDataStore, isLoginStore, isAdminStore } = useUserStore()
</script>

<template>
  <div>
    {{ userDataStore }}
  </div>
</template>