<script setup lang="ts">
const { userName, userPicture, userRoomGrade } = defineProps<{
    userName: string;
    userPicture: string;
    userRoomGrade: string;
}>();
</script>

<template>
    <div class="flex items-center gap-3 px-3 py-2 bg-quaternary w-fit rounded-lg">
        <NuxtImg
            :src="userPicture"
            :alt="userName"
            class="rounded-full w-8 h-8"
        />
        <div class="">
            <p class="">{{ userName }}</p>
            <p class="text-[0.5rem] uppercase bg-quinary rounded px-2">{{ userRoomGrade }}</p>
        </div>
    </div>
</template>