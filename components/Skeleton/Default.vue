<script setup lang="ts">
	defineProps<{
		text?: string
	}>()
</script>

<template>
	<div
		class="relative isolate flex w-full items-center justify-center overflow-hidden bg-red-100/10 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-red-100/10 before:bg-gradient-to-r before:from-transparent before:via-red-100/10 before:to-transparent"
	>
		<p v-if="text" class="text-lg text-white italic">{{ text }}</p>
	</div>
</template>
