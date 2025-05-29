import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to) => {
	const user = useSupabaseUser()
	const { userDataStore } = storeToRefs(useUserStore())
	const { ensureUserProfile } = useAuth()

	try {
		// Si pas d'utilisateur Supabase connecté
		if (!user.value) {
			return navigateTo({
				path: '/authentification',
				query: {
					redirect: to.fullPath,
				},
			})
		}

		// Si utilisateur Supabase connecté mais pas de données dans le store
		if (!userDataStore.value) {
			const success = await ensureUserProfile()

			// Vérifier à nouveau après synchronisation
			if (!success || !userDataStore.value) {
				return navigateTo({
					path: '/authentification',
					query: {
						redirect: to.fullPath,
					},
				})
			}
		}
	} catch (error) {
		console.error("Erreur lors de la vérification de l'état de l'utilisateur:", error)
		return navigateTo({
			path: '/authentification',
			query: {
				redirect: to.fullPath,
			},
		})
	}
})
