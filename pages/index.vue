<script setup>

const { firebaseUser } = useUser();

// console.log(firebaseUser.value)

useHead({
  title: 'Comeback',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'robots', content: 'noindex,nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Don\'t miss any Comeback. Track every next release by your favorite artists.' },
    { hid: 'og:site_name', property: 'og:site_name', content: 'Comeback' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:title', property: 'og:title', content: 'Comeback' },
    { hid: 'og:description', property: 'og:description', content: 'Don\'t miss any Comeback. Track every next release by your favorite artists.' },
    { hid: 'og:url', property: 'og:url', content: 'https://nuxt-firebase-auth.vercel.app/' },
    { hid: 'og:image', property: 'og:image', content: 'https://nuxt-firebase-auth.vercel.app/ogp.png' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/public/favicon.ico' },
  ]
})
</script>

<template>
  <div>
    <section
      class="animate__animated animate__fadeInDown relative px-10 xl:px-40 w-full flex flex-col justify-center h-screen sm:h-[calc(100vh-60px)]  bg-cover bg-center bg-no-repeat bg-[url('https://www.blind-magazine.com/wp-content/uploads/2021/12/comment-photographier-un-concert-fr-1536x864.jpg.webp')]">
      <div class="absolute inset-0 bg-black/60"></div>
      <div class="z-10 space-y-1.5 xl:space-y-5">
        <p class="text-[2rem] sm:text-[6vw] xl:text-7xl font-bold">
          Don't miss any <span class="text-primary">Comeback</span>
        </p>
        <p class="text-[3vw] xl:text-3xl">Track every next release by your favorite artists</p>
      </div>
      <p class="absolute bottom-5 left-0 right-0 sm:hidden">
        <!-- <icons-arrow-down class="animate-bounce w-5 h-5 mx-auto" /> -->
      </p>
    </section>
    <div class="container mx-auto p-5 min-h-screen">
      <div class="rounded-lg space-y-8">
        <LazyComebackReported class="rounded-lg animate__animated animate__fadeInUp" />
        <LazyRecentReleases class="rounded-lg animate__animated animate__fadeInUp" />
        <LazyArtistAdded class="rounded-lg animate__animated animate__fadeInUp" />
      </div>
    </div>
  </div>
</template>
