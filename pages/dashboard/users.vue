<script setup>
import { useUserStore } from '@/stores/user'
const { firebaseUserStore, userDataStore } = useUserStore()
</script>

<template>
  <div class="space-y-5">
    <pre>{{ firebaseUserStore }}</pre>
    <pre>{{ userDataStore }}</pre>
  </div>
</template>
