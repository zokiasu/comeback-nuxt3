<script setup lang="ts">
	const { userName, userRoomGrade } = defineProps<{
		userName: string
		userPicture: string
		userRoomGrade: string
	}>()
</script>

<template>
	<div class="flex w-fit items-center gap-3">
		<!-- <NuxtImg
            :src="userPicture"
            :alt="userName"
            class="w-8 h-8 rounded-full"
        /> -->
		<div class="flex gap-1">
			<p class="bg-quinary-900 w-fit rounded px-2 uppercase">{{ userRoomGrade }}</p>
			<p class="">{{ userName }}</p>
		</div>
	</div>
</template>
