<script setup>
const test = ref("https://music.youtube.com/channel/UCjqYTQjO-JG-8vLlt6-4iyQ")
</script>

<template>
  <div>
    <p>Authentification {{ test }}</p>
    <CbExternalLink :href="test" />
  </div>
</template>