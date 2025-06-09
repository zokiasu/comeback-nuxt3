export default defineNuxtRouteMiddleware((to, from) => {
	// Vérifier si l'utilisateur est connecté
	const user = useSupabaseUser()

	if (!user.value) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Vous devez être connecté pour accéder à cette page',
		})
	}

	// Vérifier les permissions admin depuis le store
	const userStore = useUserStore()

	if (!userStore.isAdminStore) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Accès refusé. Permissions administrateur requises.',
		})
	}
})
