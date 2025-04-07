import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore()
	const { firebaseUserStore, isAdminStore } = storeToRefs(userStore)

	if (process.client && firebaseUserStore.value && isAdminStore.value) {
		// L'utilisateur est connecté et est admin, on le laisse passer
	} else {
		// Redirige vers la page d'accueil ou une page d'erreur si l'utilisateur n'est pas admin
		// Ou si les informations ne sont pas encore disponibles (attente de l'initialisation Auth)
		// Ajouter un check plus robuste si nécessaire pour l'état de chargement
		console.warn('Access denied by admin middleware')
		return navigateTo('/')
	}
})
