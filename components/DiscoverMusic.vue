<template>
  <button class="group bg-quinary drop-shadow-lg rounded-lg aspect-square max-h-80 relative w-full overflow-hidden lg:aspect-video">
    <NuxtImg
      src="https://picsum.photos/600"
      class="w-full h-full object-cover rounded"
    />
    <div class="absolute inset-0 bg-secondary/50 flex flex-col py-10 justify-evenly items-center gap-8">
      <p class="text-3xl font-semibold">Discover Music</p>
      <IconPlay class="w-14 h-14 border border-tertiary rounded-full group-hover:border-quaternary group-hover:text-quaternary group-hover:bg-tertiary" />
      <div class="text-center space-y-3">
        <p class="text-2xl font-semibold">Song Name</p>
        <p class="">Artist Name</p>
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>

</script>
