<script setup>
const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()

let videoId = idYoutubeVideo.value

const isPlaying = ref(isPlayingVideo.value)
const currentTime = ref(0)
const duration = ref(0)

const playerContainer = ref(null)
const player = ref(null)
const volumeOn = ref(true)
const volume = ref(20)

onMounted(() => {
  if (document.readyState === 'complete') {
    createYTPlayer()
  } else {
    window.addEventListener('load', createYTPlayer)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('load', createYTPlayer)
  if (player.value) {
    player.value.destroy()
  }
})

const changeVideoId = (id) => {
  if (player.value) {
    player.value.cueVideoById(id)
  }
}

const createPlayer = () => {
  // height and width 100% of frame
  player.value = new window.YT.Player(playerContainer.value, {
    videoId,
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      host: 'https://www.youtube.com',
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  })
}

const createYTPlayer = () => {
  if (window.YT && window.YT.Player) {
    createPlayer()
  } else {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    window.onYouTubePlayerAPIReady = function () {
      createPlayer()
    }
  }
}

const onPlayerReady = (event) => {
  duration.value = event.target.getDuration()
  event.target.playVideo()
  setVolume(volume.value)
}

const onPlayerStateChange = (event) => {
  if (event.data === 1) {
    isPlaying.value = true
  } else if (event.data === 2 || event.data === 0) {
    isPlaying.value = false
  }
}

const togglePlayPause = () => {
  if (player.value) {
    if (isPlaying.value) {
      player.value.pauseVideo()
    } else {
      player.value.playVideo()
    }
  }
}

const seek = (seconds) => {
  if (player.value) {
    const newTime = player.value.getCurrentTime() + seconds
    player.value.seekTo(newTime)
    currentTime.value = player.value.getCurrentTime()
  }
}

const seekToTime = () => {
  if (player.value) {
    player.value.seekTo(currentTime.value)
  }
}

const setVolume = (newVolume) => {
  if (player.value) {
    player.value.setVolume(newVolume)
    volume.value = newVolume // Met à jour la valeur réactive
  }
}

const muteVolume = () => {
  if (player.value) {
    if (volumeOn.value) {
      player.value.mute()
      if (isPlaying.value) togglePlayPause()
    } else {
      player.value.unMute()
      if (!isPlaying.value) togglePlayPause()
    }
    volumeOn.value = !volumeOn.value
  }
}

const closeYTPlayer = () => {
  isPlayingVideo.value = false
  if (player.value) {
    player.value.destroy()
  }
}

watch(
  () => idYoutubeVideo.value,
  (newValue) => {
    changeVideoId(newValue)
  },
)

setTimeout(() => {
  setInterval(() => {
    if (player.value && isPlaying.value) {
      // @ts-ignore
      currentTime.value = player.value.getCurrentTime() || 0
    }
  }, 1000)
}, 5000)
</script>

<template>
  <div
    v-if="isPlayingVideo"
    class="fixed bottom-0 z-50 flex w-full flex-col items-center justify-center space-y-3 sm:items-end sm:justify-end"
  >
    <div
      ref="playerContainer"
      class="hidden aspect-video w-1/4 min-w-[20rem] overflow-hidden rounded-lg px-2 lg:block"
    ></div>
    <div class="relative flex w-full items-center justify-between bg-secondary px-5 py-3">
      <div class="flex items-center space-x-2">
        <button class="hover:text-primary" @click="seek(-10)">
          <IconBackward10 class="h-7 w-7" />
        </button>
        <button v-if="isPlaying" class="hover:text-primary" @click="togglePlayPause">
          <IconPause class="h-7 w-7" />
        </button>
        <button v-else class="hover:text-primary" @click="togglePlayPause">
          <IconPlay class="h-7 w-7" />
        </button>
        <button class="hover:text-primary" @click="seek(10)">
          <IconForward10 class="h-7 w-7" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="muteVolume">
          <IconVolumeOn v-if="volumeOn" class="h-7 w-7" />
          <IconVolumeOff v-else class="h-7 w-7" />
        </button>
        <input
          id="volume"
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="setVolume(volume)"
        />
      </div>
      <input
        type="range"
        min="0"
        :max="duration"
        v-model="currentTime"
        @input="seekToTime"
        class="absolute -top-1 left-0 h-1 w-full cursor-pointer overflow-hidden bg-primary"
      />
      <button
        class="absolute -top-6 left-2 rounded-t-lg bg-primary px-3 py-0.5 text-xs font-semibold uppercase"
        @click="closeYTPlayer"
      >
        Close
      </button>
    </div>
  </div>
</template>
