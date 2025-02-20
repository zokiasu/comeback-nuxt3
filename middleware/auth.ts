import { useUserStore } from '@/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
	const { userDataStore } = useUserStore()

	try {
		if (userDataStore === null) {
			// En cas d'erreur, rediriger vers la page de connexion
			return navigateTo({
				path: '/authentification',
				query: {
					redirect: to.fullPath,
				},
			})
		}
	} catch (error) {
		console.error("Erreur lors de la vérification de l'état de l'utilisateur:", error)
		// En cas d'erreur, rediriger vers la page de connexion
		return navigateTo({
			path: '/authentification',
			query: {
				redirect: to.fullPath,
			},
		})
	}
})
