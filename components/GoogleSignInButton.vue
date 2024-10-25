<script setup lang="ts">
  import { useAuth } from '@/composables/auth/auth.composable'

  const auth = ref(useAuth())

  const handleLoginWithGoogleClick = () => {
    auth.value.loginWithGoogle()
  }
</script>

<template>
  <div>
    <button @click="handleLoginWithGoogleClick" class="w-full flex flex-col uppercase tracking-wides font-bold gap-3 items-center justify-center rounded bg-quaternary p-5 transition-all duration-500 ease-in-out hover:bg-primary">
      <IconGoogle class="w-10 h-10" />
      <p v-if="auth.isLoading" class="flex gap-2 items-center justify-center">
        Loading...
      </p>
      <p v-else class="flex gap-2 items-center justify-center">
        Login with Google
      </p>
    </button>
  </div>
</template>