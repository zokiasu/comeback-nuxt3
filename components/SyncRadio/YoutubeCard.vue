<script setup lang="ts">
const { urlPicture, name, channelName, userName } = defineProps<{
  urlPicture: string;
  name: string;
  channelName: string;
  userName: string;
}>();
</script>


<template>
    <div class="flex items-center gap-3 p-3 h-20 rounded-lg bg-quaternary">
        <NuxtImg
            :src="urlPicture"
            :alt="name"
            class="rounded-lg object-cover h-full"
        />
        <div class="h-full flex flex-col justify-between text-sm truncate">
            <p class="font-semibold truncate">{{ name }}</p>
            <p class="text-xs">{{ channelName }}</p>
            <div class="flex gap-1">
                <p>Added by</p>
                <p class="font-semibold">{{ userName }}</p>
            </div>
        </div>
    </div>
</template>