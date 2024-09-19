<script setup lang="ts">
const { userName, userPicture, userRoomGrade } = defineProps<{
    userName: string;
    userPicture: string;
    userRoomGrade: string;
}>();
</script>

<template>
    <div class="flex items-center gap-3 w-fit">
        <!-- <NuxtImg
            :src="userPicture"
            :alt="userName"
            class="w-8 h-8 rounded-full"
        /> -->
        <div class="flex gap-1">
            <p class="px-2 uppercase rounded bg-quinary w-fit">{{ userRoomGrade }}</p>
            <p class="">{{ userName }}</p>
        </div>
    </div>
</template>