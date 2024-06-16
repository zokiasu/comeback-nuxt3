<script setup>
import toast from '~/plugins/toast';

const idYoutubeVideo = ref('')
const emit = defineEmits(['videoEnded', 'videoError', 'updateDuration']);

const isPlaying = ref(true);
const currentTime = ref(0);
const duration = ref(0);
let intervalId = null;
const playerContainer = ref(null);
const player = ref(null);
const volumeOn = ref(true);
const volume = ref(20);
const errorDetected = ref(false);

// Création du lecteur YouTube
const createPlayer = () => {
    player.value = new window.YT.Player("playerContainer", {
        videoId: idYoutubeVideo.value,
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            host: "https://come-back.netlify.app" || "https://localhost:3000",
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
        },
    });
};

const onPlayerReady = async (event) => {
    duration.value = event.target.getDuration();
};

const onPlayerStateChange = (event) => {
    isPlaying.value = event.data === window.YT.PlayerState.PLAYING;
    if (isPlaying.value) {
        errorDetected.value = false;
        duration.value = player.value.getDuration();
    } else if (event.data === window.YT.PlayerState.ENDED) {
        emit('videoEnded');
    }
};

const onPlayerError = (event) => {
    switch (event.data) {
        case 100:
        case 101:
        case 150:
            errorDetected.value = true;
            console.error("Video is restricted or unavailable.");
            if (player.value) {
                player.value.destroy();
            }
            toast.error('Video is restricted or unavailable. Please try another video.');
            emit('videoError');
            break;
    }
};

const initYTPlayer = () => {
    console.log('initYTPlayer')
    if (window.YT && window.YT.Player) {
        createPlayer();
    } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubePlayerAPIReady = createPlayer;
    }
};

const updateCurrentTime = () => {
    if (player.value && typeof player.value.getPlayerState === "function") {
        if (player.value.getPlayerState() === window.YT.PlayerState.PLAYING) {
            currentTime.value = player.value.getCurrentTime();
            // console.log('currentTime', currentTime.value);
            emit('updateDuration', currentTime.value);
        }
    }
};

onMounted(() => {
    intervalId = setInterval(updateCurrentTime, 1000);
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }

    if (player.value) {
        player.value.destroy();
    }
});

function updateVideoId(newId, time = 0) {
    console.log('updateVideoId', newId)
    if (!player.value) {
        console.log('no player');
        idYoutubeVideo.value = newId;
        initYTPlayer();
        console.log('no player end', idYoutubeVideo.value);
        if (player.value) {
            player.value.playVideo();
            if(currentTime.value > 0) {
                player.value.seekTo(currentTime.value);
            }
        }
    } else {
        console.log('player');
        player.value.loadVideoById(newId);
        if (isPlaying.value) {
            player.value.playVideo();
        }
    }

    if(time > 0) {
        currentTime.value = time;
    }
}

const seekToTime = () => {
  if (player.value) {
    player.value.seekTo(currentTime.value);
  }
};

defineExpose({ updateVideoId });
</script>

<template>
    <div class="w-full h-full">
        <div
            id="playerContainer"
            ref="playerContainer"
            class="w-full h-full"
        >
        </div>
    </div>
</template>