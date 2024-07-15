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
    <div 
        class="relative flex items-center h-20 gap-3 p-2 rounded-lg" 
        :class="{
            'group' : isAdmin,
            'bg-primary' : isActualPlaying,
            'bg-quaternary' : !isActualPlaying,
        }"
    >
        <NuxtImg
            :src="urlPicture"
            :alt="name"
            class="hidden lg:block rounded object-cover h-full min-h-full min-w-[20%] w-[20%]"
        />
        <div class="flex flex-col justify-between w-full h-full text-sm truncate">
            <p class="font-semibold truncate">{{ name }}</p>
            <p class="text-xs">{{ channelName }}</p>
            <div class="flex items-end justify-between w-full text-xs">
                <div class="flex gap-1">
                    <p>Added by</p>
                    <p class="font-semibold">{{ userName }}</p>
                </div>
                <div class="items-center hidden gap-2" :class="isAdmin ? 'group-hover:flex':''">
                    <button @click="deleteInPlaylist">
                        <IconDelete class="w-3.5 h-3.5 cursor-pointer hover:text-primary" />
                    </button>
                    <button @click="playVideo">
                        <IconPlay class="w-3.5 h-3.5 cursor-pointer hover:text-primary" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>