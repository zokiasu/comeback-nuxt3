<script setup lang="ts">
  import { useAuth } from '@/composables/auth/auth.composable'

  const auth = ref(useAuth())

  const handleLoginWithGoogleClick = () => {
    auth.value.loginWithGoogle()
  }
</script>

<template>
  <div>
    <button @click="handleLoginWithGoogleClick" class="w-full rounded bg-quinary py-2 font-semibold uppercase transition-all duration-500 ease-in-out hover:bg-zinc-500">
      <p v-if="auth.isLoading">Loading...</p>
      <p v-else class="flex gap-2 items-center justify-center">
        <IconGoogle class="w-5 h-5" />Login with Google
      </p>
    </button>
  </div>
</template>