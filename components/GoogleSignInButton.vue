<script setup lang="ts">
  import { useAuth } from '@/composables/auth/auth.composable'

  const auth = ref(useAuth())

  const handleLoginWithGoogleClick = () => {
    auth.value.loginWithGoogle()
  }
</script>

<template>
  <div>
    <button @click="handleLoginWithGoogleClick" class="w-full rounded bg-quaternary px-2 py-1 transition-all duration-500 ease-in-out hover:bg-tertiary/20">
      <p v-if="auth.isLoading" class="flex gap-2 items-center justify-center">
        <IconGoogle class="w-3.5 h-3.5" />Loading...
      </p>
      <p v-else class="flex gap-2 items-center justify-center">
        <IconGoogle class="w-3.5 h-3.5" />Login with Google
      </p>
    </button>
  </div>
</template>