<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-cb-primary-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"
			></div>
			<p class="text-lg">{{ statusMessage }}</p>
			<p v-if="debugMode" class="mt-2 text-sm text-gray-500">{{ debugInfo }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const statusMessage = ref('Connexion en cours...')
	const debugInfo = ref('')
	const debugMode = ref(false) // Activez pour debug

	// Désactiver le middleware auth pour cette page
	definePageMeta({
		middleware: [],
	})

	const user = useSupabaseUser()
	const { ensureUserProfile } = useAuth()

	const handleAuthCallback = async () => {
		try {
			statusMessage.value = 'Vérification de la session...'
			debugInfo.value = "Attente de l'utilisateur Supabase..."

			// Attendre que l'utilisateur Supabase soit disponible
			let attempts = 0
			const maxAttempts = 30 // 30 secondes max

			while (!user.value && attempts < maxAttempts) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				attempts++
				debugInfo.value = `Tentative ${attempts}/${maxAttempts}...`
			}

			if (!user.value) {
				console.error('❌ Timeout: Aucun utilisateur trouvé après 30 secondes')
				statusMessage.value = 'Erreur de connexion'
				await navigateTo('/authentification?error=timeout')
				return
			}

			console.log('🔍 Callback - Utilisateur Supabase:', user.value)
			console.log('✅ Utilisateur connecté!')
			console.log('📧 Email:', user.value.email)
			console.log('🆔 ID:', user.value.id)

			statusMessage.value = 'Synchronisation du profil...'
			debugInfo.value = 'Création/mise à jour du profil utilisateur...'

			// Synchroniser le profil utilisateur
			const success = await ensureUserProfile()

			if (success) {
				statusMessage.value = 'Redirection...'
				debugInfo.value = "Connexion réussie, redirection vers l'accueil"

				// Petite pause pour que l'utilisateur voie le message de succès
				await new Promise((resolve) => setTimeout(resolve, 500))

				await navigateTo('/')
			} else {
				console.error('❌ Erreur lors de la synchronisation du profil')
				statusMessage.value = 'Erreur de synchronisation'
				await navigateTo('/authentification?error=sync')
			}
		} catch (err: any) {
			console.error('❌ Erreur lors du callback:', err)
			statusMessage.value = 'Erreur de connexion'
			debugInfo.value = err.message || 'Erreur inconnue'
			await navigateTo('/authentification?error=callback')
		}
	}

	// Gérer le callback d'authentification au montage du composant
	onMounted(async () => {
		// Petite pause pour laisser Supabase s'initialiser
		await new Promise((resolve) => setTimeout(resolve, 500))
		await handleAuthCallback()
	})
</script>
