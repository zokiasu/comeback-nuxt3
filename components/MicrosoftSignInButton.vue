<script setup lang="ts">
  import { useAuth } from '@/composables/auth/auth.composable'

  const auth = ref(useAuth())

  const handleLoginWithMicrosoftClick = () => {
    auth.value.loginWithMicrosoft()
  }
</script>

<template>
  <div>
    <button @click="handleLoginWithMicrosoftClick" class="w-full rounded bg-quinary py-2 font-semibold uppercase transition-all duration-500 ease-in-out hover:bg-zinc-500">
      <p v-if="auth.isLoading">Loading...</p>
      <p v-else class="flex gap-2 items-center justify-center">
        <IconMicrosoft class="w-5 h-5" />Login with Microsoft
      </p>
    </button>
  </div>
</template>