<script setup>

const idYoutubeVideo = useIdYoutubeVideo()
const isPlayingVideo = useIsPlayingVideo()

let videoId = idYoutubeVideo.value

const isPlaying = ref(isPlayingVideo.value);
const currentTime = ref(0);
const duration = ref(0);

const playerContainer = ref(null);
const player = ref(null);
const volumeOn = ref(true);

onMounted(() => {
  createYTPlayer()
});

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy();
  }
});

const changeVideoId = (id) => {
  videoId = id
  if (player.value) player.value.destroy();
  createYTPlayer();
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
  });
}

const createYTPlayer = () => {
  if (window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubePlayerAPIReady = function () {
      createPlayer();
    }
  }
}

const onPlayerReady = (event) => {
  duration.value = event.target.getDuration();
  event.target.playVideo();
};

const onPlayerStateChange = (event) => {
  if (event.data === 1) {
    isPlaying.value = true;
  } else if (event.data === 2 || event.data === 0) {
    isPlaying.value = false;
  }
};

const togglePlayPause = () => {
  if (player.value) {
    if (isPlaying.value) {
      player.value.pauseVideo();
    } else {
      player.value.playVideo();
    }
  }
};

const seek = (seconds) => {
  if (player.value) {
    const newTime = player.value.getCurrentTime() + seconds;
    player.value.seekTo(newTime);
    currentTime.value = player.value.getCurrentTime();
  }
};

const seekToTime = () => {
  if (player.value) {
    player.value.seekTo(currentTime.value);
  }
};

const setVolume = (volume) => {
  if (player.value) {
    player.value.setVolume(volume);
  }
};

const muteVolume = () => {
  if (player.value) {
    if (volumeOn.value) {
      player.value.mute();
      if (isPlaying.value) togglePlayPause()
    } else {
      player.value.unMute();
      if (!isPlaying.value) togglePlayPause()
    }
    volumeOn.value = !volumeOn.value;
  }
};

const closeYTPlayer = () => {
  isPlayingVideo.value = false
  if (player.value) {
    player.value.destroy();
  }
}

watch(
  () => idYoutubeVideo.value,
  (newValue) => {
    changeVideoId(newValue)
  }
)

setTimeout(() => {
  setInterval(() => {
    if (player.value && isPlaying.value) {
      // @ts-ignore
      currentTime.value = player.value.getCurrentTime() || 0;
    }
  }, 1000);
}, 5000);
</script>

<template>
  <div v-if="isPlayingVideo"
    class="flex flex-col items-center justify-center sm:items-end sm:justify-end space-y-3 fixed bottom-0 z-50 w-full">
    <div 
      ref="playerContainer" 
      class="overflow-hidden min-w-[20rem] w-1/4 aspect-video rounded-lg px-2 hidden lg:block"
    ></div>
    <div class="bg-secondary flex items-center justify-between relative py-3 px-5 w-full">
      <div class="space-x-2 flex items-center">
        <button class="hover:text-primary" @click="seek(-10)">
          <IconBackward10 class="w-7 h-7" />
        </button>
        <button v-if="isPlaying" class="hover:text-primary" @click="togglePlayPause">
          <IconPause class="w-7 h-7" />
        </button>
        <button v-else class="hover:text-primary" @click="togglePlayPause">
          <IconPlay class="w-7 h-7" />
        </button>
        <button class="hover:text-primary" @click="seek(10)">
          <IconForward10 class="w-7 h-7" />
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="muteVolume">
          <IconVolumeOn v-if="volumeOn" class="w-7 h-7" />
          <IconVolumeOff v-else class="w-7 h-7" />
        </button>
        <input id="volume" type="range" min="0" max="100" v-model="volume" @input="setVolume(volume)" />
      </div>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seekToTime"
        class="absolute -top-1 w-full left-0 overflow-hidden bg-primary h-1 cursor-pointer" />
      <button class="absolute -top-6 left-2 bg-primary rounded-t-lg px-3 py-0.5 text-xs font-semibold uppercase"
        @click="closeYTPlayer">Close</button>
    </div>
  </div>
</template>