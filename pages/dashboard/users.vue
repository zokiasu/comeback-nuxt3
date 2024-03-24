<script setup>
import { useUserStore } from '@/stores/user'
const { firebaseUserStore, userDataStore } = useUserStore()
</script>

<template>
  <div ref="scrollContainer" class="relative space-y-3 h-full overflow-y-scroll overflow-hidden scrollBarLight pr-2">
    <pre>{{ firebaseUserStore }}</pre>
    <pre>{{ userDataStore }}</pre>
  </div>
</template>
