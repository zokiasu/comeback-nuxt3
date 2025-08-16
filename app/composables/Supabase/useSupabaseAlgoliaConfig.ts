interface AlgoliaConfigItem {
	setting_name: string
	setting_value: string
}

export function useSupabaseAlgoliaConfig() {
	const supabase = useSupabaseClient()
	const toast = useToast()

	// Configuration Algolia par défaut
	const defaultConfig = {
		ALGOLIA_APPLICATION_ID: '',
		ALGOLIA_API_KEY: '',
		ALGOLIA_INDEX_NAME: 'ARTISTS',
		ALGOLIA_SEARCH_ENABLED: 'true',
		ALGOLIA_AUTO_SYNC: 'true',
		ALGOLIA_BATCH_SIZE: '100',
	}

	// Récupérer toute la configuration Algolia
	const getAlgoliaConfig = async (): Promise<Record<string, string>> => {
		const { data, error } = await supabase.from('algolia_config').select('*')

		if (error) {
			console.error('Erreur lors de la récupération de la config Algolia:', error)
			return defaultConfig
		}

		// Convertir le tableau en objet
		const config: Record<string, string> = { ...defaultConfig }
		data?.forEach((item) => {
			config[item.setting_name] = item.setting_value
		})

		return config
	}

	// Mettre à jour un paramètre de configuration
	const updateAlgoliaConfigItem = async (settingName: string, settingValue: string) => {
		const { data, error } = await supabase
			.from('algolia_config')
			.upsert({
				setting_name: settingName,
				setting_value: settingValue,
			})
			.select()
			.single()

		if (error) {
			console.error('Erreur lors de la mise à jour de la config:', error)
			toast.add({
				title: 'Erreur',
				description: `Erreur lors de la mise à jour de ${settingName}`,
				color: 'error',
			})
			throw error
		}

		toast.add({
			title: 'Configuration mise à jour',
			description: `${settingName} a été mis à jour avec succès`,
			color: 'success',
		})

		return data
	}

	// Mettre à jour plusieurs paramètres en une fois
	const updateAlgoliaConfig = async (config: Record<string, string>) => {
		const configItems: AlgoliaConfigItem[] = Object.entries(config).map(
			([key, value]) => ({
				setting_name: key,
				setting_value: value,
			}),
		)

		const { data, error } = await supabase
			.from('algolia_config')
			.upsert(configItems)
			.select()

		if (error) {
			console.error('Erreur lors de la mise à jour de la config:', error)
			toast.add({
				title: 'Erreur',
				description: 'Erreur lors de la mise à jour de la configuration',
				color: 'error',
			})
			throw error
		}

		toast.add({
			title: 'Configuration mise à jour',
			description: 'La configuration Algolia a été mise à jour avec succès',
			color: 'success',
		})

		return data
	}

	// Supprimer un paramètre de configuration
	const deleteAlgoliaConfigItem = async (settingName: string) => {
		const { error } = await supabase
			.from('algolia_config')
			.delete()
			.eq('setting_name', settingName)

		if (error) {
			console.error('Erreur lors de la suppression de la config:', error)
			toast.add({
				title: 'Erreur',
				description: `Erreur lors de la suppression de ${settingName}`,
				color: 'error',
			})
			throw error
		}

		toast.add({
			title: 'Paramètre supprimé',
			description: `${settingName} a été supprimé de la configuration`,
			color: 'success',
		})

		return true
	}

	// Réinitialiser la configuration aux valeurs par défaut
	const resetAlgoliaConfig = async () => {
		// Supprimer toute la config existante
		const { error: deleteError } = await supabase
			.from('algolia_config')
			.delete()
			.neq('setting_name', '')

		if (deleteError) {
			console.error('Erreur lors de la suppression de la config:', deleteError)
			throw deleteError
		}

		// Insérer la config par défaut
		const configItems: AlgoliaConfigItem[] = Object.entries(defaultConfig).map(
			([key, value]) => ({
				setting_name: key,
				setting_value: value,
			}),
		)

		const { data, error } = await supabase
			.from('algolia_config')
			.insert(configItems)
			.select()

		if (error) {
			console.error('Erreur lors de la réinitialisation de la config:', error)
			toast.add({
				title: 'Erreur',
				description: 'Erreur lors de la réinitialisation de la configuration',
				color: 'error',
			})
			throw error
		}

		toast.add({
			title: 'Configuration réinitialisée',
			description: 'La configuration Algolia a été réinitialisée aux valeurs par défaut',
			color: 'success',
		})

		return data
	}

	// Tester la configuration Algolia (utilise la fonction SQL si disponible)
	const testAlgoliaConnection = async () => {
		try {
			const { data, error } = await supabase.rpc('test_algolia_connection')

			if (error) {
				console.error('Erreur lors du test de connexion Algolia:', error)
				toast.add({
					title: 'Test échoué',
					description: 'Impossible de tester la connexion Algolia',
					color: 'error',
				})
				return { success: false, message: error.message }
			}

			const isSuccess = data?.includes('success') || data?.includes('OK')

			toast.add({
				title: isSuccess ? 'Test réussi' : 'Test échoué',
				description: data || 'Test de connexion terminé',
				color: isSuccess ? 'success' : 'error',
			})

			return { success: isSuccess, message: data }
		} catch (error: any) {
			console.error('Erreur lors du test de connexion:', error)
			toast.add({
				title: 'Test échoué',
				description: 'Erreur lors du test de connexion Algolia',
				color: 'error',
			})
			return { success: false, message: error.message }
		}
	}

	// Déclencher la synchronisation de tous les artistes vers Algolia
	const syncAllArtistsToAlgolia = async () => {
		try {
			const { data, error } = await supabase.rpc('sync_all_artists_to_algolia')

			if (error) {
				console.error('Erreur lors de la synchronisation:', error)
				toast.add({
					title: 'Synchronisation échouée',
					description: 'Erreur lors de la synchronisation des artistes',
					color: 'error',
				})
				throw error
			}

			toast.add({
				title: 'Synchronisation réussie',
				description: data || 'Tous les artistes ont été synchronisés avec Algolia',
				color: 'success',
			})

			return data
		} catch (error: any) {
			console.error('Erreur lors de la synchronisation:', error)
			throw error
		}
	}

	// Déclencher la synchronisation de toutes les musiques vers Algolia
	const syncAllMusicsToAlgolia = async () => {
		try {
			const { data, error } = await supabase.rpc('sync_all_musics_to_algolia')

			if (error) {
				console.error('Erreur lors de la synchronisation des musiques:', error)
				toast.add({
					title: 'Synchronisation échouée',
					description: 'Erreur lors de la synchronisation des musiques',
					color: 'error',
				})
				throw error
			}

			toast.add({
				title: 'Synchronisation réussie',
				description: data || 'Toutes les musiques ont été synchronisées avec Algolia',
				color: 'success',
			})

			return data
		} catch (error: any) {
			console.error('Erreur lors de la synchronisation des musiques:', error)
			throw error
		}
	}

	// Déclencher la synchronisation de toutes les releases vers Algolia
	const syncAllReleasesToAlgolia = async () => {
		try {
			const { data, error } = await supabase.rpc('sync_all_releases_to_algolia')

			if (error) {
				console.error('Erreur lors de la synchronisation des releases:', error)
				toast.add({
					title: 'Synchronisation échouée',
					description: 'Erreur lors de la synchronisation des releases',
					color: 'error',
				})
				throw error
			}

			toast.add({
				title: 'Synchronisation réussie',
				description: data || 'Toutes les releases ont été synchronisées avec Algolia',
				color: 'success',
			})

			return data
		} catch (error: any) {
			console.error('Erreur lors de la synchronisation des releases:', error)
			throw error
		}
	}

	// Vérifier si Algolia est activé
	const isAlgoliaEnabled = async (): Promise<boolean> => {
		const config = await getAlgoliaConfig()
		return (
			config.ALGOLIA_SEARCH_ENABLED === 'true' &&
			config.ALGOLIA_APPLICATION_ID !== '' &&
			config.ALGOLIA_API_KEY !== ''
		)
	}

	// Activer/désactiver Algolia
	const toggleAlgolia = async (enabled: boolean) => {
		await updateAlgoliaConfigItem('ALGOLIA_SEARCH_ENABLED', enabled.toString())
		return enabled
	}

	return {
		// Configuration
		getAlgoliaConfig,
		updateAlgoliaConfigItem,
		updateAlgoliaConfig,
		deleteAlgoliaConfigItem,
		resetAlgoliaConfig,

		// Tests et synchronisation
		testAlgoliaConnection,
		syncAllArtistsToAlgolia,
		syncAllMusicsToAlgolia,
		syncAllReleasesToAlgolia,

		// Utilitaires
		isAlgoliaEnabled,
		toggleAlgolia,

		// Configuration par défaut
		defaultConfig,
	}
}
