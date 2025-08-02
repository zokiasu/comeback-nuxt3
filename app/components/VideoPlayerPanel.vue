<script setup lang="ts">
	const isOpen = defineModel<boolean>('isOpen', { default: false })
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed bottom-20 right-4 z-[1200]"
	>
		<div
			class="bg-cb-secondary-950 aspect-video w-80 min-w-[20rem] max-w-md overflow-hidden rounded-lg shadow-xl lg:h-72"
		>
			<!-- Header -->
			<div class="border-cb-tertiary-700 flex items-center justify-between border-b p-3">
				<h3 class="text-sm font-semibold">Lecteur vidéo</h3>
				<button
					class="text-cb-tertiary-400 hover:text-cb-tertiary-200 rounded p-1"
					@click="isOpen = false"
				>
					<IconClose class="h-4 w-4" />
				</button>
			</div>

			<!-- Video Container -->
			<div
				id="globalPlayerContainer"
				class="flex-1 w-full h-full"
			></div>
		</div>
	</div>
</template>