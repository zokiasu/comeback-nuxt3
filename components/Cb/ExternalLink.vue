<template>
  <NuxtLink v-if="href" rel="noopener" :to="checkUrl()" target="_blank"
    class="flex items-center md:space-x-2 md:px-3 md:py-2 transition-all duration-300 ease-in-out hover:bg-secondary hover:drop-shadow-2xl">
    <component :is="icon" class="h-5 w-5" />
    <p class="hidden md:block">{{ text }}</p>
  </NuxtLink>
</template>

<script setup>
const icon = shallowRef(null)
const text = shallowRef(null)

const { href } = defineProps({
  href: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  selectIcon()
})

function checkUrl() {
  if (href.includes('https')) {
    return href
  } else {
    return `https://${href}`
  }
}

function selectIcon() {
  if (href.includes('youtube') && href.includes('music.')) {
    icon.value = resolveComponent('icon-youtube-music')
    text.value = 'Youtube Music'
  } else if (href.includes('youtube')) {
    icon.value = resolveComponent('icon-youtube')
    text.value = 'Youtube'
  } else if (href.includes('apple') && href.includes('music')) {
    icon.value = resolveComponent('icon-apple-music')
    text.value = 'Apple Music'
  } else if (href.includes('spotify')) {
    icon.value = resolveComponent('icon-spotify')
    text.value = 'Spotify'
  } else if (href.includes('tidal')) {
    icon.value = resolveComponent('icon-tidal')
    text.value = 'Tidal'
  } else if (href.includes('soundcloud')) {
    icon.value = resolveComponent('icon-soundcloud')
    text.value = 'Soundcloud'
  } else if (href.includes('facebook')) {
    icon.value = resolveComponent('icon-facebook')
    text.value = 'Facebook'
  } else if (href.includes('instagram')) {
    icon.value = resolveComponent('icon-instagram')
    text.value = 'Instagram'
  } else if (href.includes('twitter')) {
    icon.value = resolveComponent('icon-twitter')
    text.value = 'Twitter'
  } else if (href.includes('tiktok')) {
    icon.value = resolveComponent('icon-tiktok')
    text.value = 'Tiktok'
  } else if (href.includes('snapchat')) {
    icon.value = resolveComponent('icon-snapchat')
    text.value = 'Snapchat'
  } else if (href.includes('weibo')) {
    icon.value = resolveComponent('icon-weibo')
    text.value = 'Weibo'
  } else {
    icon.value = resolveComponent('icon-unknow')
    text.value = extractRootDomain(href)
  }
}

function extractRootDomain(url) {
  let domain = extractHostname(url)
  const splitArr = domain.split('.')
  const arrLen = splitArr.length
  // extracting the root domain here
  // if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
    // check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (
      splitArr[arrLen - 2].length === 2 &&
      splitArr[arrLen - 1].length === 2
    ) {
      // this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain
    }
  }
  // remove '.com'
  const n = domain.indexOf('.')
  domain = domain.substring(0, n !== -1 ? n : domain.length)
  // Uppercase first letter
  let x = domain.charAt(0).toUpperCase() + domain.slice(1)
  if (x === 'Qq') {
    x = domain.toUpperCase()
  }
  if (
    x === 'Youtube' ||
    x === 'Apple' ||
    x === 'Huawei' ||
    x === 'Amazon' ||
    x === 'Line' ||
    x === 'QQ' ||
    x === 'Stingray'
  ) {
    x = x + ' Music'
  }
  if (url.includes('www.youtube')) {
    x = 'Youtube'
  }
  return x
}

function extractHostname(url) {
  let hostname
  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.includes('//')) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  // find & remove port number
  hostname = hostname.split(':')[0]
  // find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}
</script>
