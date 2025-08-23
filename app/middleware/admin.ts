export default defineNuxtRouteMiddleware((to, from) => {
	// D'abord vérifier si l'utilisateur est connecté
	const user = useSupabaseUser()

	if (!user.value) {
		return navigateTo('/authentification')
	}

	// Ensuite vérifier les permissions admin depuis le store
	const userStore = useUserStore()

	if (!userStore.isAdminStore) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Accès refusé. Permissions administrateur requises.',
		})
	}
})
