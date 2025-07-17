import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(async () => {
	// Configuration Pinia avec persistance côté client
	if (import.meta.client) {
		console.log('🔧 Initialisation des stores côté client avec persistance')

		const { $pinia } = useNuxtApp()

		if ($pinia) {
			// Ajouter le plugin de persistance
			$pinia.use(
				createPersistedState({
					storage: localStorage,
					key: (id) => `__persisted__${id}`,
				}),
			)

			console.log('✅ Pinia avec persistance configuré')
		} else {
			console.warn('⚠️ Pinia non disponible côté client')
		}
	}
})
