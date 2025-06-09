export default defineNuxtPlugin(() => {
	// Désactiver les console.log en production uniquement côté client
	if (import.meta.client && import.meta.env.PROD) {
		console.log = () => {}
		console.info = () => {}
		console.debug = () => {}
		// Garder console.warn et console.error pour les vrais problèmes

		console.warn('🚀 Mode production: console.log désactivés')
	}
})
