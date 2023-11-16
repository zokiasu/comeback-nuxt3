<template>
  <NuxtLink
    :aria-label="`${name}'s link`"
    rel="noopener"
    :to="link"
    target="_blank"
    class="flex h-fit w-fit items-center gap-2 rounded bg-quaternary px-3.5 py-2.5 text-sm hover:bg-quinary"
  >
    <NuxtImg provider="netlify" :src="icon" :alt="name" class="h-5 w-5" />
    <p class="hidden text-xs font-semibold uppercase md:block">{{ name }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
const { link, name } = defineProps({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
})

const icon = computed(() => {
  if (link.includes('youtube') && link.includes('music.')) {
    return 'https://come-back.netlify.app/youtube_music.png'
  } else if (link.includes('youtube')) {
    return 'https://come-back.netlify.app/youtube.png'
  } else if (link.includes('apple') && link.includes('music')) {
    return 'https://come-back.netlify.app/apple_music.png'
  } else if (link.includes('spotify')) {
    return 'https://come-back.netlify.app/spotify.png'
  } else if (link.includes('tidal')) {
    return 'https://come-back.netlify.app/tidal.png'
  } else if (link.includes('soundcloud')) {
    return 'https://come-back.netlify.app/sound_cloud.png'
  } else if (link.includes('facebook')) {
    return 'https://come-back.netlify.app/facebook.png'
  } else if (link.includes('instagram')) {
    return 'https://come-back.netlify.app/instagram.png'
  } else if (link.includes('twitter') || link.includes('x.com')) {
    return 'https://come-back.netlify.app/x.png'
  } else if (link.includes('tiktok')) {
    return 'https://come-back.netlify.app/tiktok.png'
  } else if (link.includes('snapchat')) {
    return 'https://come-back.netlify.app/snapchat.png'
  } else if (link.includes('weibo')) {
    return 'https://come-back.netlify.app/weibo.png'
  } else if (link.includes('deezer')) {
    return 'https://come-back.netlify.app/deezer.png'
  } else {
    return 'https://come-back.netlify.app/default.png'
  }
})
</script>
