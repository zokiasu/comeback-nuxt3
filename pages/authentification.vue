<script setup lang="ts">
	useHead({
		title: 'Authentification',
		meta: [
			{
				name: 'description',
				content: 'Authentification',
			},
		],
	})

	// Log initial
	console.log('📄 Page authentification chargée')

	// Gestion des erreurs de callback
	const route = useRoute()
	const errorMessage = ref('')

	onMounted(() => {
		const error = route.query.error
		if (error) {
			switch (error) {
				case 'timeout':
					errorMessage.value = 'Délai d\'attente dépassé lors de la connexion. Veuillez réessayer.'
					break
				case 'sync':
					errorMessage.value = 'Erreur lors de la synchronisation du profil. Veuillez réessayer.'
					break
				case 'callback':
					errorMessage.value = 'Erreur lors du processus de connexion. Veuillez réessayer.'
					break
				default:
					errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
			}
		}
	})
</script>

<template>
	<div class="flex items-center justify-center sm:min-h-[calc(100vh-160px)]">
		<div class="w-full md:w-1/2 lg:w-1/3">
			<!-- Message d'erreur -->
			<div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
				<div class="flex items-center">
					<div class="text-red-500 mr-3">⚠️</div>
					<p class="text-red-700 text-sm">{{ errorMessage }}</p>
				</div>
			</div>
			
			<GoogleSignInButton />
		</div>
	</div>
</template>
