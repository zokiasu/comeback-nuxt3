<script setup lang="ts">
	defineProps({
		error: Object,
	})

	const handleError = () => {
		clearError({ redirect: '/' })
	}
</script>

<template>
	<div class="flex min-h-screen flex-col items-center justify-center gap-5 p-5">
		<h1 class="text-4xl font-black">
			{{ error?.statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue' }}
		</h1>
		<p class="text-center">
			{{ error?.message || "Désolé, une erreur inattendue s'est produite." }}
		</p>
		<button
			class="rounded bg-primary px-3 py-2 font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105"
			@click="handleError"
		>
			Retourner à l'accueil
		</button>
	</div>
</template>
