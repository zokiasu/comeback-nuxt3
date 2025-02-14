<template>
	<div class="relative h-full">
		<div
			class="absolute inset-0 z-10 h-full w-full bg-quinary object-cover transition-all duration-500 ease-in-out"
			:class="imageLoaded ? 'opacity-0' : 'opacity-100'"
		></div>
		<NuxtImg
			format="webp"
			:alt="name"
			:src="image"
			class="h-full w-full object-cover"
			@load="imageLoaded = true"
		/>
		<NuxtLink
			:to="`/artist/${id}`"
			class="absolute inset-0 z-50 flex flex-col items-start justify-end bg-secondary/30 p-5 sm:items-center sm:justify-center"
		>
			<p class="text-3xl font-bold lg:text-5xl xl:text-7xl 2xl:text-9xl">
				{{ name }}
			</p>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	defineOptions({
		inheritAttrs: false,
	})

	const props = defineProps<{
		image: string
		name: string
		id: string
	}>()

	const imageLoaded = ref(false)
</script>
