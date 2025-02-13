<template>
	<NuxtLink
		:aria-label="`${name}'s link`"
		rel="noopener"
		:to="link"
		target="_blank"
		class="flex items-center gap-2 rounded bg-quaternary px-3.5 py-2.5 text-xs hover:bg-quinary"
	>
		<img :src="icon" :alt="name" class="h-4 w-4" />
		<p class="hidden text-xs font-semibold uppercase md:block">{{ name }}</p>
	</NuxtLink>
</template>

<script setup lang="ts">
	const { link, name } = defineProps({
		name: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
	})

	const icon = computed(() => {
		if (link.includes('youtube') && link.includes('music.')) {
			return '/youtube_music.png'
		} else if (link.includes('youtube')) {
			return '/youtube.png'
		} else if (link.includes('apple') && link.includes('music')) {
			return '/apple_music.png'
		} else if (link.includes('amazon') && link.includes('music')) {
			return '/amazon_music.png'
		} else if (link.includes('spotify')) {
			return '/spotify.png'
		} else if (link.includes('tidal')) {
			return '/tidal.png'
		} else if (link.includes('soundcloud')) {
			return '/sound_cloud.png'
		} else if (link.includes('facebook')) {
			return '/facebook.png'
		} else if (link.includes('instagram')) {
			return '/instagram.png'
		} else if (link.includes('twitter') || link.includes('x.com')) {
			return '/x.png'
		} else if (link.includes('tiktok')) {
			return '/tiktok.png'
		} else if (link.includes('snapchat')) {
			return '/snapchat.png'
		} else if (link.includes('weibo')) {
			return '/weibo.png'
		} else if (link.includes('deezer')) {
			return '/deezer.png'
		} else {
			return '/default.png'
		}
	})
</script>
