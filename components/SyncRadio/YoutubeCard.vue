<script setup lang="ts">
const { urlPicture, name, channelName, userName, isAdmin } = defineProps<{
  urlPicture: string;
  name: string;
  channelName: string;
  userName: string;
  isAdmin: boolean;
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
    <div class="relative flex items-center gap-3 p-3 h-20 rounded-lg bg-quaternary" :class="isAdmin ? 'group':''">
        <NuxtImg
            :src="urlPicture"
            :alt="name"
            class="rounded-lg object-cover h-full"
            provider="static"
        />
        <div class="h-full flex flex-col justify-between text-sm truncate">
            <p class="font-semibold truncate">{{ name }}</p>
            <p class="text-xs">{{ channelName }}</p>
            <div class="flex items-end text-xs justify-between">
                <div class="flex gap-1">
                    <p>Added by</p>
                    <p class="font-semibold">{{ userName }}</p>
                </div>
                <div class="hidden items-center gap-2" :class="isAdmin ? 'group-hover:flex':''">
                    <button @click="deleteInPlaylist">
                        <IconDelete class="w-4 h-4 cursor-pointer hover:text-primary" />
                    </button>
                    <button @click="playVideo">
                        <IconPlay class="w-5 h-5 cursor-pointer hover:text-primary" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>