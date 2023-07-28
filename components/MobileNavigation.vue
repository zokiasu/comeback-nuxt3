<script setup>
const { isAdmin } = useUser();
</script>

<template>
  <div class="fixed bottom-5 px-5 w-full">
    <div
      class="w-full flex justify-between divide-x-2 rounded-full bg-secondary drop-shadow-sm overflow-hidden border border-zinc-700 shadow shadow-zinc-700">
      <NuxtLink 
        :to="`/`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconHome class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        :to="`/calendar`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconCalendar class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        :to="`/artist`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconSearch class="w-5 h-5 mx-auto" />
      </NuxtLink>
      <NuxtLink 
        v-if="isAdmin"
        :to="`/dashboard/artist`"
        class="flex items-center justify-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500"
      >
        <IconEdit class="w-5 h-5 mx-auto" />
      </NuxtLink>
    </div>
  </div>
</template>