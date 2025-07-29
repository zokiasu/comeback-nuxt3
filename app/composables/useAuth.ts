import { storeToRefs } from 'pinia'

export const useAuth = () => {
	const user = useSupabaseUser()
	const supabase = useSupabaseClient()
	const userStore = useUserStore()

	// Utiliser storeToRefs pour préserver la réactivité
	const { userDataStore, isLoginStore, isAdminStore, supabaseUserStore } =
		storeToRefs(userStore)

	// Destructurer les actions (pas besoin de storeToRefs pour les fonctions)
	const { syncUserProfile, setUserData, setIsLogin, setSupabaseUser, resetStore } =
		userStore

	// Fonction pour créer ou mettre à jour un utilisateur (intégrée depuis useSupabaseUserManager)
	const createOrUpdateUser = async (authUser: any): Promise<any | null> => {
		if (!authUser) return null

		try {
			// Vérifier si l'utilisateur existe déjà
			let existingUser, fetchError

			if (process.dev) {
				// Timeout uniquement en développement
				const timeoutPromise = new Promise((_, reject) => {
					setTimeout(() => reject(new Error('Dev database timeout')), 2000)
				})

				const fetchPromise = supabase
					.from('users')
					.select('*')
					.eq('id', authUser.id)
					.single()

				const result = (await Promise.race([fetchPromise, timeoutPromise])) as any
				existingUser = result.data
				fetchError = result.error
			} else {
				// Pas de timeout en production
				const result = await supabase
					.from('users')
					.select('*')
					.eq('id', authUser.id)
					.single()

				existingUser = result.data
				fetchError = result.error
			}

			if (fetchError && fetchError.code !== 'PGRST116') {
				console.error("Erreur lors de la récupération de l'utilisateur:", fetchError)
				throw fetchError
			}

			const userData: any = {
				id: authUser.id,
				email: authUser.email || '',
				name:
					authUser.user_metadata?.full_name ||
					authUser.user_metadata?.name ||
					'Utilisateur',
				photo_url:
					authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
				role: existingUser?.role || 'USER',
				updated_at: new Date().toISOString(),
			}

			if (!existingUser) {
				// Créer un nouvel utilisateur
				userData.created_at = new Date().toISOString()

				const { data: newUser, error: createError } = await supabase
					.from('users')
					.insert([userData])
					.select()
					.single()

				if (createError) {
					console.error("Erreur lors de la création de l'utilisateur:", createError)
					throw createError
				}

				console.log('✅ Nouvel utilisateur créé:', newUser)
				return newUser
			} else {
				// Mettre à jour l'utilisateur existant
				const { data: updatedUser, error: updateError } = await supabase
					.from('users')
					.update(userData)
					.eq('id', authUser.id)
					.select()
					.single()

				if (updateError) {
					console.error("Erreur lors de la mise à jour de l'utilisateur:", updateError)
					throw updateError
				}

				console.log('✅ Utilisateur mis à jour:', updatedUser)
				return updatedUser
			}
		} catch (error) {
			console.error('Erreur dans createOrUpdateUser:', error)
			throw error
		}
	}

	// État de synchronisation
	const isSyncing = ref(false)
	const syncError = ref<string | null>(null)

	// Fonction pour synchroniser le profil utilisateur
	const ensureUserProfile = async () => {
		if (!user.value) {
			console.log('❌ Aucun utilisateur Supabase connecté')
			await resetStore()
			return false
		}

		// Si l'utilisateur Supabase existe mais qu'on n'a pas de données dans le store
		// ou si l'ID ne correspond pas, on re-synchronise
		if (!userDataStore.value || userDataStore.value.id !== user.value.id) {
			try {
				isSyncing.value = true
				syncError.value = null
				console.log('🔄 Synchronisation du profil utilisateur...')

				const userData = await createOrUpdateUser(user.value)
				await syncUserProfile(user.value, userData)

				console.log('✅ Profil synchronisé avec succès')
				return true
			} catch (error: any) {
				console.error('❌ Erreur lors de la synchronisation:', error)
				syncError.value = error.message || 'Erreur de synchronisation'
				await resetStore()
				return false
			} finally {
				isSyncing.value = false
			}
		}

		// Si tout est déjà synchronisé
		if (userDataStore.value && isLoginStore.value) {
			console.log('✅ Profil utilisateur déjà synchronisé')
			return true
		}

		return false
	}

	// Fonction de déconnexion
	const logout = async () => {
		try {
			const supabase = useSupabaseClient()
			const { error: logoutError } = await supabase.auth.signOut()

			if (logoutError) {
				throw logoutError
			}

			// Réinitialiser le store
			await resetStore()

			await navigateTo('/authentification')
		} catch (err: any) {
			console.error('Erreur lors de la déconnexion:', err)
		}
	}

	// Fonction d'initialisation au chargement de l'app
	const initializeAuth = async () => {
		console.log("🚀 Initialisation de l'authentification...")

		// Si on a un utilisateur Supabase et des données dans le store
		if (user.value && userDataStore.value && userDataStore.value.id === user.value.id) {
			console.log('✅ Session restaurée depuis le cache')
			return true
		}

		// Si on a un utilisateur Supabase mais pas de données dans le store
		if (user.value) {
			console.log('🔄 Utilisateur Supabase détecté, synchronisation...')
			return await ensureUserProfile()
		}

		// Aucun utilisateur connecté
		console.log('ℹ️ Aucun utilisateur connecté')
		await resetStore()
		return false
	}

	// Watcher pour surveiller les changements d'utilisateur Supabase
	let isInitialized = false
	watch(
		user,
		async (newUser, oldUser) => {
			// Initialisation une seule fois au démarrage
			if (!isInitialized) {
				isInitialized = true
				await initializeAuth()
				return
			}

			// Gestion des changements d'utilisateur après l'initialisation
			if (newUser && !oldUser) {
				console.log('👤 Nouvelle connexion détectée')
				await ensureUserProfile()
			} else if (!newUser && oldUser) {
				console.log('👋 Déconnexion détectée')
				await resetStore()
			} else if (newUser && oldUser && newUser.id !== oldUser.id) {
				console.log("🔄 Changement d'utilisateur détecté")
				await ensureUserProfile()
			}
		},
		{ immediate: true },
	)

	return {
		// États
		user,
		userData: userDataStore,
		isLogin: isLoginStore,
		isAdmin: isAdminStore,
		supabaseUser: supabaseUserStore,
		isSyncing: readonly(isSyncing),
		syncError: readonly(syncError),

		// Actions
		ensureUserProfile,
		initializeAuth,
		logout,
	}
}
