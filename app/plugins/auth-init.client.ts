export default defineNuxtPlugin(async () => {
	// Plugin d'initialisation de l'authentification côté client
	if (import.meta.client) {
		// Ne pas initialiser sur la page de callback pour éviter les conflits
		const route = useRoute()
		if (route.path === '/auth/callback') {
			console.log('🔐 Page de callback détectée, initialisation différée')
			return
		}

		console.log("🔐 Initialisation de l'authentification au démarrage...")

		// Attendre que Nuxt soit prêt
		await nextTick()

		try {
			// Initialiser l'authentification
			const { initializeAuth } = useAuth()
			const { logError, logInfo } = useErrorLogger()
			
			logInfo('Starting authentication initialization')
			await initializeAuth()
			logInfo('Authentication initialized successfully')

			console.log('✅ Authentification initialisée')
		} catch (error) {
			const { logError } = useErrorLogger()
			logError(error, 'auth-init-plugin')
			
			console.error("❌ Erreur lors de l'initialisation de l'authentification:", error)
		}
	}
})
