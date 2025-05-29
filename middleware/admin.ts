import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
	const userStore = useUserStore()
	const { supabaseUserStore, isAdminStore } = storeToRefs(userStore)

	if (import.meta.client && supabaseUserStore.value && isAdminStore.value) {
		// L'utilisateur est connecté et est admin, on le laisse passer
	} else {
		// Redirige vers la page d'accueil ou une page d'erreur si l'utilisateur n'est pas admin
		// Ou si les informations ne sont pas encore disponibles (attente de l'initialisation Auth)
		// Ajouter un check plus robuste si nécessaire pour l'état de chargement
		console.warn('Access denied by admin middleware')
		return navigateTo('/')
	}
})
