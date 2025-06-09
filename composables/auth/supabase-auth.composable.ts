import { useUserStore } from '@/stores/user'
import type { Database } from '~/types'

export const useSupabaseAuth = () => {
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const loginWithGoogle = async () => {
		console.log('🚀 Début de la connexion Google...')
		isLoading.value = true
		error.value = null

		try {
			// Utiliser le client Supabase global
			const supabase = useSupabaseClient()
			console.log('📡 Client Supabase initialisé:', !!supabase)

			const { data, error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${useRequestURL().origin}/auth/callback`,
				},
			})

			console.log('📊 Réponse OAuth:', { data, error: authError })

			if (authError) {
				console.error('❌ Erreur OAuth:', authError)
				throw authError
			}

			console.log('✅ Redirection vers Google initiée')
		} catch (err: any) {
			console.error('❌ Erreur lors de la connexion Google:', err)
			error.value = err.message || 'Erreur de connexion'
		} finally {
			isLoading.value = false
		}
	}

	const handleAuthCallback = async () => {
		try {
			const user = useSupabaseUser()
			const { ensureUserProfile } = useAuth()

			console.log('🔍 Callback - Utilisateur Supabase:', user.value)

			if (user.value) {
				console.log('✅ Utilisateur connecté!')
				console.log('📧 Email:', user.value.email)
				console.log('🆔 ID:', user.value.id)
				console.log('👤 Métadonnées:', user.value.user_metadata)
				console.log('🔗 Identités:', user.value.identities)
				console.log('📅 Créé le:', user.value.created_at)
				console.log('🔄 Dernière connexion:', user.value.last_sign_in_at)

				// Synchroniser le profil utilisateur
				await ensureUserProfile()

				await navigateTo('/')
			} else {
				console.log('❌ Aucun utilisateur trouvé dans le callback')
			}
		} catch (err: any) {
			console.error('❌ Erreur lors du callback:', err)
			error.value = err.message || 'Erreur de callback'
		}
	}

	const logout = async () => {
		const { logout: authLogout } = useAuth()
		try {
			await authLogout()
		} catch (err: any) {
			console.error('Erreur lors de la déconnexion:', err)
			error.value = err.message || 'Erreur de déconnexion'
		}
	}

	return {
		isLoading,
		error,
		loginWithGoogle,
		logout,
		handleAuthCallback,
	}
}
