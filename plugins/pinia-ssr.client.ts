export default defineNuxtPlugin(async () => {
	// Plugin client-only pour gérer l'hydratation des stores
	if (import.meta.client) {
		console.log('🔧 Initialisation des stores côté client après SSR')
		
		const { $pinia } = useNuxtApp()
		
		// Vérification que Pinia est disponible
		if ($pinia) {
			console.log('✅ Pinia disponible côté client')
		} else {
			console.warn('⚠️ Pinia non disponible côté client')
		}
	}
}) 