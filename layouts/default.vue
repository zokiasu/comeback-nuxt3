<template>
  <div class="bg-secondary text-tertiary min-h-screen">
    <Navigation class="hidden md:block" />
    <div class="pt-5 md:hidden">
      <img class="block h-9 w-auto mx-auto" src="~/assets/image/logo.png" alt="Comeback" />
    </div>
    <slot />
    <Footer />
    <MobileNavigation class="md:hidden" />
  </div>
</template>
