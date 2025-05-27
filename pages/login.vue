<script setup lang="ts">
// Redirection vers la page d'authentification
await navigateTo('/authentification')
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p class="text-gray-600">Redirection...</p>
    </div>
  </div>
</template> 