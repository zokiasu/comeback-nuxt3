<template>
  <div>
    <h1>Test Page</h1>
    <p>Cette page fonctionne si vous voyez ce message.</p>
    <p>Timestamp: {{ timestamp }}</p>
  </div>
</template>

<script setup>
const timestamp = new Date().toISOString()
console.log('Test page loaded at:', timestamp)
</script>