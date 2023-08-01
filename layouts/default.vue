<template>
  <div class="bg-secondary text-tertiary min-h-screen">
    <LazyNavigation class="hidden md:block" />
    <div class="z-50 inset-x-0 md:hidden" :class="useRoute().name === 'index' ? 'absolute top-5' : 'py-5 '">
      <img src="~/assets/image/logo.png" alt="Comeback" quality="80" loading="lazy" class="block h-9 w-auto mx-auto"/>
    </div>
    <main class="min-h-[calc(100vh-60px)]">
      <slot />
    </main>
    <LazyFooter />
    <LazyMobileNavigation class="md:hidden" />
  </div>
</template>
