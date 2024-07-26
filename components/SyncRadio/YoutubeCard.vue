<script setup lang="ts">
const { urlPicture, name, channelName, userName, isAdmin, isActualPlaying } = defineProps<{
    urlPicture: string;
    name: string;
    channelName: string;
    userName: string;
    isAdmin: boolean;
    isActualPlaying: boolean;
}>();

const emit = defineEmits(['deleteInPlaylist', 'playVideo']);

const deleteInPlaylist = () => {
  emit('deleteInPlaylist');
};

const playVideo = () => {
  emit('playVideo');
};
</script>


<template>
    <button 
        @click="playVideo"
        class="relative flex items-center w-full gap-3 p-2 rounded-lg text-start" 
        :class="{
            'group' : isAdmin,
            'bg-primary' : isActualPlaying,
            'bg-quaternary' : !isActualPlaying,
        }"
    >
        <NuxtImg
            :src="urlPicture"
            :alt="name"
            class="hidden lg:block rounded object-cover h-full min-h-full min-w-[20%] max-w-[20%]"
        />
        <div class="relative w-full h-full text-sm truncate">
            <p class="font-semibold truncate">{{ name }}</p>
            <p class="text-xs">{{ channelName }}</p>
            <div class="hidden gap-1 text-xs lg:flex">
                <p>Added by</p>
                <p class="font-semibold">{{ userName }}</p>
            </div>
            <div class="absolute bottom-0 right-0 items-center gap-2 2xl:hidden" :class="isAdmin ? '2xl:group-hover:flex':''">
                <button @click="deleteInPlaylist">
                    <IconDelete class="w-3.5 h-3.5 cursor-pointer hover:text-primary" />
                </button>
            </div>
        </div>
    </button>
</template>