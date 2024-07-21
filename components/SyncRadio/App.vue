<script setup>
import { useFirebaseRealtimeDatabase } from "~/composables/useFirebaseRealtimeDatabase";
import { useFirebaseFunction } from "~/composables/useFirebaseFunction";
import { useUserStore } from "~/stores/user";
import { useToast } from "vue-toastification";

import debounce from "lodash.debounce";

// Initialisation des réactifs
const searchComebackInput = ref("");
const datas = ref([]);
const maxResults = ref(10);

// Utilisation de Algolia Search de manière optimisée
const { result, search } = useAlgoliaSearch("Musics");

// Définition d'une fonction de recherche débattue
const debouncedSearch = debounce(async (query) => {
  await useAsyncData("ssr-search-results", () => search({ query }));
  datas.value = result.value.hits;
}, 500); // Attend 500ms après le dernier appel avant d'exécuter la fonction

watchEffect(() => {
  if (searchComebackInput.value.length > 1) {
    debouncedSearch(searchComebackInput.value);
  } else {
    datas.value = [];
  }
});

const searchMusicComeback = computed(() => {
  return datas.value.slice(0, maxResults.value);
});

const {
  writeData,
  readData,
  updateData,
  deleteData,
  listenForUpdates,
} = useFirebaseRealtimeDatabase();
const { getVideoFullDetails, getAllVideosFromPlaylist } = useFirebaseFunction();

const { roomId } = defineProps({
  roomId: {
    type: String,
    required: true,
  },
});

const userStore = useUserStore();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const lastRoomYouTryToJoined = useLastRoomYouTryToJoined();

const playerRef = ref(null);
const messagePanel = ref(null);
const roomPlaylistElement = ref(null);
const recommandationCard1 = ref(null);
const recommandationCard2 = ref(null);
const recommandationCard3 = ref(null);

const searchOnComeback = ref(false);
const blurEffectLoading = ref(false);
const errorMessage = ref(false);
const youtubeUrlInput = ref("");
const roomPlaylist = ref([]);
const currentUsers = ref([]);
const videoRefs = ref([]);
const isAdminRoom = ref(false);
const isEveryoneCanAddSong = ref(false);
const permanentRoom = ref(false);
const actualVideoPlay = ref({
  id: null,
  title: null,
  thumbnail: null,
  duration: null,
  channelTitle: null,
  index: null,
  addedBy: {
    id: null,
    name: null,
  },
});

const userData = computed(() => userStore.userDataStore);
const moderators = computed(() =>
  currentUsers.value.filter(
    (user) => user.status === "moderator" || user.status === "administrator"
  )
);
const listeners = computed(() =>
  currentUsers.value.filter((user) => user.status === "listener")
);
const isAllowedToAddSong = computed(
  () => isEveryoneCanAddSong.value || isAdminRoom.value
);

function checkIfUserIsCreator(users, userId) {
  return users.some((user) => user.id === userId && user.status === "administrator");
}

function checkIfUserIsAlredyInRoom(users, userId) {
  return users.some((user) => user.id === userId);
}

function extractYouTubeId(url) {
  const videoRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/;
  const playlistRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/playlist\?list=|music\.youtube\.com\/playlist\?list=|youtube\.com\/watch\?.*[\&\?]list=)([\w-]+)/;

  const videoMatch = url.match(videoRegex);
  const playlistMatch = url.match(playlistRegex);
  return {
    videoId: videoMatch ? videoMatch[1] : null,
    playlistId: playlistMatch ? playlistMatch[1] : null,
  };
}

function convertDuration(duration) {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match[1] ? match[1].slice(0, -1) : "0";
  const seconds = match[2] ? match[2].slice(0, -1).padStart(2, "0") : "00";
  return `${minutes}:${seconds}`;
}

function shareRoomUrl() {
  const url = window.location.href;
  navigator.clipboard.writeText(url);
  toast.success("Room link copied to clipboard.");
}

function copyIdRoom() {
  navigator.clipboard.writeText(roomId);
  toast.success("Room ID copied to clipboard.");
}

const setVideoRef = (el, index) => {
  videoRefs.value[index] = el;
};

const scrollToCurrentVideo = (index) => {
  if (roomPlaylistElement.value) {
    //scroll to element with isPlaying class
    const element = roomPlaylistElement.value.children[index];

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }
};

const updateDurationActualVideoPlay = (duration) => {
  if (isAdminRoom.value && duration > 0) {
    actualVideoPlay.value.duration = duration;
    updateData("/syncradio/" + roomId + "/actualVideoPlay/", actualVideoPlay.value);
  }
};

const updateActualVideoPlay = (videoData) => {
  actualVideoPlay.value = videoData;
  if (actualVideoPlay.value.id) {
    writeData("/syncradio/" + roomId + "/actualVideoPlay/", videoData);
  } else {
    deleteData("/syncradio/" + roomId + "/actualVideoPlay/");
  }
};

const updateSettings = (settingToUpdate, state) => {
  if (isAdminRoom.value) {
    const settings = {
      isEveryoneDJ:
        settingToUpdate === "isEveryoneDJ" ? state : isEveryoneCanAddSong.value,
      isTemporary: settingToUpdate === "isTemporary" ? state : permanentRoom.value,
    };
    updateData("/syncradio/" + roomId + "/settings/", settings);
  }
};

const nextVideo = () => {
  if (roomPlaylist.value) {
    const video = roomPlaylist.value[actualVideoPlay.value.index + 1];
    if (video) {
      updateActualVideoPlay(video);
      scrollToCurrentVideo(video.index);
    }
  }
};

const setNewVideo = (index) => {
  if (isEveryoneCanAddSong.value || isAdminRoom.value) {
    if (roomPlaylist.value) {
      const video = roomPlaylist.value[index];
      updateActualVideoPlay(video);
      nextTick(() => {
        scrollToCurrentVideo(index);
      });
    }
  } else {
    toast.error("Sorry you are not allowed to play a video. Ask a admin or a moderator.");
  }
};

const deleteVideo = (index) => {
  if (isEveryoneCanAddSong.value || isAdminRoom.value) {
    roomPlaylist.value.splice(index, 1);
    reIndexAllPlaylist();
    reIndexActualPlayingVideo();
  } else {
    toast.error(
      "Sorry you are not allowed to delete a video. Ask a admin or a moderator."
    );
  }
};

const reIndexAllPlaylist = () => {
  roomPlaylist.value.forEach((video, index) => {
    video.index = index;
  });
  writeData("/syncradio/" + roomId + "/playlist/", roomPlaylist.value);
};

const reIndexActualPlayingVideo = () => {
  actualVideoPlay.value.index =
    roomPlaylist.value?.findIndex((video) => video.id === actualVideoPlay.value.id) || 0;
  writeData("/syncradio/" + roomId + "/actualVideoPlay/", actualVideoPlay.value);
};

const getDetailsVideoFromId = (videoId) => {
  getVideoFullDetails(videoId, config.public.YOUTUBE_API_KEY).then((data) => {
    const videoData = {
      id: data.id,
      title: data.snippet.title,
      thumbnail: data.snippet.thumbnails.default.url,
      duration: convertDuration(data.contentDetails.duration),
      channelTitle: data.snippet.channelTitle,
      addedBy: {
        id: userData.value.id,
        name: userData.value.name,
      },
    };
    if (
      isEveryoneCanAddSong.value ||
      (isAdminRoom.value && (!actualVideoPlay.value || !actualVideoPlay.value.id))
    ) {
      videoData.index = 0;
      updateActualVideoPlay(videoData);
      addInPlaylist(videoData);
    } else if (isEveryoneCanAddSong.value || isAdminRoom.value) {
      if (!roomPlaylist.value?.length) {
        videoData.index = 0;
      } else {
        if (roomPlaylist.value.length) {
          videoData.index = roomPlaylist.value.length;
        } else {
          videoData.index = 0;
        }
      }
      addInPlaylist(videoData);
    } else {
      actualVideoPlay.value = videoData; // Mise à jour pour les utilisateurs non administrateurs
    }
  });
};

const getYoutubeVideo = () => {
  const { videoId, playlistId } = extractYouTubeId(youtubeUrlInput.value);

  if (videoId && !playlistId) {
    getDetailsVideoFromId(videoId);
  } else if (playlistId) {
    getAllVideosFromPlaylist(playlistId, config.public.YOUTUBE_API_KEY).then((data) => {
      data.forEach(async (video) => {
        await getDetailsVideoFromId(video.snippet.resourceId.videoId);
      });
    });
  }
  youtubeUrlInput.value = "";
};

const addInPlaylist = (data) => {
  if (isEveryoneCanAddSong.value || isAdminRoom.value) {
    roomPlaylist.value = roomPlaylist.value || [];
    roomPlaylist.value.push(data);
    writeData("/syncradio/" + roomId + "/playlist/", roomPlaylist.value);
  }
};

const addInPlaylistFromRecommandation = (videoId) => {
  getVideoFullDetails(videoId, config.public.YOUTUBE_API_KEY).then((data) => {
    const videoData = {
      id: data.id,
      title: data.snippet.title,
      thumbnail: data.snippet.thumbnails.default.url,
      duration: convertDuration(data.contentDetails.duration),
      channelTitle: data.snippet.channelTitle,
      addedBy: {
        id: userData.value.id,
        name: userData.value.name,
      },
    };

    if (
      (isEveryoneCanAddSong.value || isAdminRoom.value) &&
      (!actualVideoPlay.value || !actualVideoPlay.value.id)
    ) {
      videoData.index = 0;
      updateActualVideoPlay(videoData);
      addInPlaylist(videoData);
    } else if (isEveryoneCanAddSong.value || isAdminRoom.value) {
      if (!roomPlaylist.value) {
        videoData.index = 0;
      } else {
        videoData.index = roomPlaylist.value.length;
      }
      addInPlaylist(videoData);
    } else {
      actualVideoPlay.value = videoData; // Mise à jour pour les utilisateurs non administrateurs
    }
  });
  searchComebackInput.value = "";
  datas.value = [];
};

const addUserToRoom = async () => {
  const currentUser = {
    id: userData.value.id,
    name: userData.value.name,
    onlineStatus: true,
    status: "listener",
  };
  currentUsers.value.push(currentUser);
  writeData("/syncradio/" + roomId + "/users/", currentUsers.value);
};

const checkUserDataUpdate = async () => {
  if (userData.value.id) {
    const data = await readData("/syncradio/" + roomId);
    let user = data.users.find((user) => user.id === userData.value.id);
    if (userData.value.name != user.name) {
      const userIndex = data.users.findIndex((user) => user.id === userData.value.id);
      user.name = userData.value.name;
      writeData("/syncradio/" + roomId + "/users/" + userIndex, data.users);
    }
  }
};

const videoError = () => {
  toast.error("Video is restricted or unavailable. Please try another video.");
  errorMessage.value = true;
};

const deletePlaylist = () => {
  if (isEveryoneCanAddSong.value || isAdminRoom.value) {
    roomPlaylist.value = [];
    writeData("/syncradio/" + roomId + "/playlist/", roomPlaylist.value);
    reIndexActualPlayingVideo();
  } else {
    toast.error(
      "Sorry you are not allowed to delete the playlist. Ask a admin or a moderator."
    );
  }
};

const isActualPlayingInYoutubeCard = (index, videoId) => {
  return actualVideoPlay?.value?.id === videoId && actualVideoPlay.value.index === index;
};

const reloadAllRecommandationCard = () => {
  recommandationCard1.value.reloadRandomMusic();
  recommandationCard2.value.reloadRandomMusic();
  recommandationCard3.value.reloadRandomMusic();
};

const lastUpdateTime = () => {
  updateData("/syncradio/" + roomId, { lastUpdate: new Date().toISOString() });
};

const resetPlayer = () => {
  if (playerRef.value) {
    errorMessage.value = false;
    playerRef.value.reloadPlayer();
  }
};

watch(
  () => actualVideoPlay?.value?.id,
  (newId) => {
    if (newId && playerRef.value) {
      playerRef.value.updateVideoId(newId, actualVideoPlay.value.duration);
    }
  }
);

onMounted(async () => {
  await userStore.checkUserAuthState();

  lastRoomYouTryToJoined.value = roomId;
  const dataRouteRadio = "/syncradio/" + roomId;
  const data = await readData(dataRouteRadio);
  let isCreator = false;

  if (data && userData.value && roomId) {
    roomPlaylist.value = data.playlist;
    currentUsers.value = data.users;
    isEveryoneCanAddSong.value = data.settings.isEveryoneDJ;
    permanentRoom.value = data.settings.isTemporary;

    listenForUpdates(dataRouteRadio, (data) => {
      roomPlaylist.value = data.playlist;
      currentUsers.value = data.users;
      actualVideoPlay.value = data.actualVideoPlay;
      isEveryoneCanAddSong.value = data.settings.isEveryoneDJ;
      permanentRoom.value = data.settings.isTemporary;
      isCreator = checkIfUserIsCreator(data.users, userData.value.id);
      if (!isCreator && actualVideoPlay.value && playerRef.value) {
        playerRef.value.seekToTimer(actualVideoPlay.value.duration);
      }
      errorMessage.value = false;
    });

    if (checkIfUserIsAlredyInRoom(data.users, userData.value.id)) {
      isCreator = checkIfUserIsCreator(data.users, userData.value.id);

      checkUserDataUpdate();
      if (isCreator) {
        isAdminRoom.value = true;
      }
    } else {
      addUserToRoom();
    }

    messagePanel.value.getMessages(roomId);

    nextTick(() => {
      const currentIndex = actualVideoPlay.value?.index;
      if (typeof currentIndex === "number" && roomPlaylist.value) {
        scrollToCurrentVideo(currentIndex);
      }
    });
  } else if (!data) {
    toast.error("Room not found. Please create a new room.");
    router.push("/syncradio");
  }
});
</script>

<template>
  <main id="syncRadioApp" class="relative grid gap-3 px-5 pb-10 text-xs transition-all duration-300 ease-out lg:pb-0 2xl:pb-5 xl:text-base grid-cols-custom grid-rows-custom min-h-dvh-wo-nav max-h-dvh-wo-nav">
  
    <section id="searchInputElement" class="space-y-2 lg:row-start-1 lg:col-start-1 lg:col-end-3">
      <div class="flex justify-between space-x-2 text-sm">
        <div class="flex">
          <button
            @click="searchOnComeback = true"
            class="px-3 py-1 rounded"
            :class="searchOnComeback ? 'border border-primary lg:bg-primary lg:border-none' : 'hover:bg-quinary'"
          >
            <IconComeback class="w-4 h-4 lg:hidden" />
            <span class="hidden lg:block">
              Search on
              <span class="font-bold" :class="searchOnComeback ? 'text-tertiary ' : 'text-primary'">Comeback</span>
            </span>
          </button>
          <button
            @click="searchOnComeback = false"
            class="px-3 py-1 rounded"
            :class="searchOnComeback ? 'hover:bg-quinary' : 'border border-primary lg:bg-primary lg:border-none'"
          >
            <IconYoutube class="w-4 h-4 lg:hidden" />
            <span class="hidden lg:block">
              Add Youtube URL
            </span>
          </button>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="copyIdRoom"
            class="flex items-center justify-center w-full gap-1 px-3 py-1 transition-all duration-300 ease-in-out rounded lg:justify-start lg:w-fit lg:py-1 bg-quinary text-tertiary hover:bg-tertiary/30"
          >
            <IconCopy class="w-4 h-4" />
            <span class="hidden lg:block">
              Copy ID
            </span>
          </button>
          <button
            @click="shareRoomUrl"
            class="flex items-center justify-center w-full gap-1 px-3 py-1 transition-all duration-300 ease-in-out rounded lg:justify-start lg:w-fit lg:py-1 bg-quinary text-tertiary hover:bg-tertiary/30"
          >
            <IconShare class="w-4 h-4" />
            <span class="hidden lg:block">
              Share Room
            </span>
          </button>
        </div>
      </div>

      <div v-if="searchOnComeback" class="flex gap-3">
        <div class="relative w-full">
          <input
            id="search-input"
            v-model="searchComebackInput"
            type="text"
            placeholder="Search a song"
            :disabled="!isAllowedToAddSong"
            class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded disabled:opacity-50 bg-quinary placeholder-tertiary drop-shadow-xl focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
          />
          <button
            v-if="searchComebackInput.length"
            class="absolute right-2.5 inset-y-0 text-quaternary hover:text-primary"
            @click="
              searchComebackInput = '';
              datas = [];
            "
          >
            <IconClose class="w-5 h-5" />
          </button>
        </div>
        <div
          v-if="searchMusicComeback.length"
          class="absolute inset-x-0 z-50 py-5 rounded top-20 drop-shadow bg-quaternary gap-x-5 lg:px-10"
        >
          <div class="hidden gap-3 lg:flex">
            <p>Limit Result :</p>
            <button
              :class="maxResults === 10 ? 'font-bold' : ''"
              @click="maxResults = 10"
            >
              10
            </button>
            <button
              :class="maxResults === 20 ? 'font-bold' : ''"
              @click="maxResults = 20"
            >
              20
            </button>
          </div>
          <div class="grid w-full grid-cols-1 lg:grid-cols-2">
            <div
              v-for="(data, index) in searchMusicComeback"
              :key="data.objectID"
              class="hover:bg-primary/10 px-3 py-1.5 rounded cursor-pointer text-sm flex justify-between items-center gap-3"
              @click="addInPlaylistFromRecommandation(data.objectID)"
            >
              <div class="flex items-center gap-3">
                <NuxtImg
                  :src="data.mvThumbnails.default.url"
                  :alt="data.name"
                  class="w-20 rounded aspect-video"
                />
                <div>
                  <p>
                    <span class="text-base font-semibold">{{ data.name }}</span> -
                    {{ data.album.name }}
                  </p>
                  <div class="flex gap-1 text-xs">
                    <p class="truncate">{{ data.artists[0].name }}</p>
                    <p v-if="data.hasMv" class="px-1 font-semibold rounded bg-primary">
                      MV
                    </p>
                  </div>
                </div>
              </div>
              <div class="p-2 rounded bg-quinary">
                <IconPlus class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <form v-else @submit.prevent="getYoutubeVideo" class="flex gap-3">
        <input
          id="search-input"
          v-model="youtubeUrlInput"
          type="text"
          placeholder="Youtube URL"
          :disabled="!isAllowedToAddSong"
          class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded disabled:opacity-50 bg-quinary placeholder-tertiary drop-shadow-xl focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
        />
        <button
          type="submit"
          :disabled="!isAllowedToAddSong"
          class="px-3 lg:w-full disabled:opacity-50 sm:max-w-[10rem] overflow-hidden bg-primary rounded py-2 text-tertiary font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-primary/90"
        >
          <IconPlus class="w-5 h-5 mx-auto lg:hidden" />
          <span class="hidden lg:block">Add URL</span>
        </button>
      </form>
    </section>

    <section id="playerVideo" class="relative flex flex-col items-center justify-center w-full h-full bg-green-500 rounded lg:row-start-2 lg:col-start-2 lg:col-end-3 aspect-video lg:aspect-auto">
      <p v-if="errorMessage" class="p-5 text-lg font-semibold">
        You are probably using your YouTube account on another page or device.
        Consider stopping it to fully enjoy SyncRadio.
      </p>
      <button
        v-if="errorMessage"
        @click="resetPlayer"
        class="p-2 transition-all duration-300 ease-in-out rounded-lg bg-quaternary hover:bg-primary"
      >
        Reload Player
      </button>
      <SyncRadioYoutubePlayer
        ref="playerRef"
        @videoEnded="nextVideo"
        @videoError="videoError"
        @updateDuration="updateDurationActualVideoPlay($event)"
        class="z-40"
      />
    </section>
  
    <section id="playlist" class="p-2 space-y-2 overflow-hidden text-xs rounded lg:row-start-2 lg:col-start-1 lg:col-end-2 bg-quinary">
      <div class="flex justify-between w-full">
        <div class="flex gap-3">
          <p class="font-semibold uppercase">Playlist</p>
          <button
            v-if="isAllowedToAddSong && roomPlaylist"
            @click="nextVideo"
            class="flex hover:text-primary"
          >
            <p class="text-xs">Next Song</p>
            <IconDoubleArrowRight class="w-5 h-5 cursor-pointer" />
          </button>
        </div>
        <button v-if="isAdminRoom && roomPlaylist" @click="deletePlaylist">
          <IconDelete class="w-5 h-5 cursor-pointer hover:text-primary" />
        </button>
      </div>
      
      <div
        ref="roomPlaylistElement"
        class="flex flex-col w-full h-full gap-2 overflow-hidden overflow-y-auto max-h-[93%] remove-scrollbar"
      >
        <SyncRadioYoutubeCard
          v-for="(video, index) in roomPlaylist"
          :key="'videoPlaylist_' + index"
          :ref="setVideoRef"
          :urlPicture="video.thumbnail"
          :name="video.title"
          :channelName="video.channelTitle"
          :userName="video.addedBy.name"
          :isAdmin="isAdminRoom"
          :isActualPlaying="isActualPlayingInYoutubeCard(index, video.id)"
          @deleteInPlaylist="deleteVideo(index)"
          @playVideo="setNewVideo(index)"
          :class="isActualPlayingInYoutubeCard(index, video.id) ? 'isPlaying' : ''"
        />
      </div>
    </section>

    <SyncRadioMessagePanel
      v-if="userData"
      ref="messagePanel"
      :idRoom="roomId"
      :idActualUser="userData.id"
      :nameActualUser="userData.name"
      :isModerator="isAdminRoom"
      class="md:row-start-1 md:row-end-5 md:col-start-2 md:col-end-3 lg:col-start-3 lg:col-end-4 xl:row-end-4"
      :class="blurEffectLoading ? 'filter blur-sm' : ''"
    />
    
    <section id="recommandation" class="hidden p-3 text-xs rounded lg:row-start-3 lg:col-start-1 lg:col-end-2 lg:block bg-quinary">
      <div class="flex items-center justify-between w-full">
        <p class="font-semibold uppercase">Recommandation</p>
        <button
          @click="reloadAllRecommandationCard"
          class="p-1 transition-all duration-300 ease-in-out rounded bg-quaternary hover:bg-primary"
        >
          <IconReload class="w-4 h-4" />
        </button>
      </div>
      <div class="flex flex-col divide-y divide-tertiary/30">
        <LazySyncRadioRecommandationCard
          id="recommandation-card-1"
          ref="recommandationCard1"
          :isAdminRoom="isAllowedToAddSong"
          @addInPlaylist="addInPlaylistFromRecommandation"
        />
        <LazySyncRadioRecommandationCard
          id="recommandation-card-2"
          ref="recommandationCard2"
          :isAdminRoom="isAllowedToAddSong"
          @addInPlaylist="addInPlaylistFromRecommandation"
        />
        <LazySyncRadioRecommandationCard
          id="recommandation-card-3"
          ref="recommandationCard3"
          :isAdminRoom="isAllowedToAddSong"
          @addInPlaylist="addInPlaylistFromRecommandation"
        />
      </div>
    </section>

    <section v-if="isAdminRoom" id="moderation" class="w-full">
        <div class="space-y-1">
          <p class="font-semibold">SETTINGS</p>
          <div class="flex flex-col gap-2 lg:gap-5 lg:flex-rowtext-xs">
            <div class="space-y-1">
              <p>Who’s allow to add songs?</p>
              <div class="flex gap-1">
                <button
                  @click="updateSettings('isEveryoneDJ', false)"
                  class="px-4 py-1 rounded"
                  :class="isEveryoneCanAddSong ? 'bg-quaternary hover:bg-primary' : 'bg-primary'"
                >
                  Moderator
                </button>
                <button
                  @click="updateSettings('isEveryoneDJ', true)"
                  class="px-4 py-1 rounded"
                  :class="
                    isEveryoneCanAddSong ? 'bg-primary' : 'bg-quaternary hover:bg-primary'
                  "
                >
                  Everyone
                </button>
              </div>
            </div>
            
            <div class="space-y-1">
              <p>Did you want to save this room and playlist?</p>
              <div class="flex gap-1">
                <button
                  @click="updateSettings('isTemporary', true)"
                  class="px-4 py-1 rounded"
                  :class="permanentRoom ? 'bg-primary' : 'bg-quaternary hover:bg-primary'"
                >
                  Yes
                </button>
                <button
                  @click="updateSettings('isTemporary', false)"
                  class="px-4 py-1 rounded"
                  :class="permanentRoom ? 'bg-quaternary hover:bg-primary' : 'bg-primary'"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
</template>

<style scoped>
  .auto-resizing {
    field-sizing: content;
  }

  .grid-rows-custom {
    grid-template-rows: 8% 1fr 15% 1fr 15%;

    @media (min-width: 768px) {
      grid-template-rows: 12% 1fr 1fr;
    }

    @media (min-width: 1024px) {
      grid-template-rows: 9% 1fr 30%;
    }

    @media (min-width: 1920px) {
      grid-template-rows: 9% 1fr 25%;
    }
  }

  .grid-cols-custom {
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: 25% 1fr 20%;
    }

    @media (min-width: 1440px) {
      grid-template-columns: 20% 1fr 20%;
    }
  }
</style>
