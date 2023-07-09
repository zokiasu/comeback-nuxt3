<template>
  <div class="fixed bottom-5 px-5 w-full">
    <div
      class="shadow-zinc-500 border-t-zinc-500 shadow-md border-t flex justify-between divide-x-2 rounded-full w-full bg-secondary">
      <NuxtLink :to="`/`" class="text-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500">H
      </NuxtLink>
      <NuxtLink :to="`/calendar`"
        class="text-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500">C</NuxtLink>
      <NuxtLink :to="`/artist`"
        class="text-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500">A</NuxtLink>
      <NuxtLink :to="`/`" class="text-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500">P
      </NuxtLink>
      <NuxtLink :to="`/dashboard`"
        class="text-center w-full py-2 hover:bg-zinc-500/50 transition-all ease-in-out duration-500">D</NuxtLink>
    </div>
  </div>
</template>