<script setup lang="ts">
useHead({
  title: 'Authentification',
  meta: [
    {
      name: 'description',
      content: 'Authentification',
    },
  ],
})
</script>

<template>
  <div class="flex items-center justify-center sm:min-h-[calc(100vh-160px)]">
    <div class="w-full md:w-1/2 lg:w-1/3">
      <GoogleSignInButton />
    </div>
  </div>
</template>
