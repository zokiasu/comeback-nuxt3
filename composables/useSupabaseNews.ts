import { useToast } from 'vue-toastification'
import { useSupabase } from './useSupabase'
import type { News, Artist, QueryOptions, FilterOptions } from '~/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseNews() {
	const { supabase } = useSupabase() as { supabase: SupabaseClient }
	const toast = useToast()

	// Crée une nouvelle news
	const createNews = async (data: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
		const { data: news, error } = await supabase
			.from('news')
			.insert(data)
			.select()
			.single()

		if (error) {
			console.error('Erreur lors de la création de la news:', error)
			toast.error('Erreur lors de la création de la news')
			return null
		}

		return news as News
	}

	// Met à jour une news
	const updateNews = async (id: string, updates: Partial<News>) => {
		const { data, error } = await supabase
			.from('news')
			.update(updates)
			.eq('id', id)
			.select()
			.single()

		if (error) {
			console.error('Erreur lors de la mise à jour de la news:', error)
			toast.error('Erreur lors de la mise à jour de la news')
			return null
		}

		return data as News
	}

	// Supprime une news
	const deleteNews = async (id: string) => {
		const { error } = await supabase.from('news').delete().eq('id', id)

		if (error) {
			console.error('Erreur lors de la suppression de la news:', error)
			toast.error('Erreur lors de la suppression de la news')
			return false
		}

		return true
	}

	// Récupère toutes les news
	const getAllNews = async (options?: QueryOptions & FilterOptions) => {
		let query = supabase.from('news').select('*')

		if (options?.search) {
			query = query.ilike('message', `%${options.search}%`)
		}

		if (options?.startDate) {
			query = query.gte('date', options.startDate)
		}

		if (options?.endDate) {
			query = query.lte('date', options.endDate)
		}

		if (options?.verified !== undefined) {
			query = query.eq('verified', options.verified)
		}

		if (options?.orderBy) {
			query = query.order(options.orderBy, {
				ascending: options.orderDirection === 'asc',
			})
		} else {
			query = query.order('date', { ascending: false })
		}

		if (options?.limit) {
			query = query.limit(options.limit)
		}

		if (options?.offset) {
			query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
		}

		const { data, error } = await query

		if (error) {
			console.error('Erreur lors de la récupération des news:', error)
			return []
		}

		return data as News[]
	}

	// Récupère une news avec tous ses détails
	const getNewsById = async (id: string) => {
		if (!id) return null

		try {
			// Récupérer la news
			const { data: news, error: newsError } = await supabase
				.from('news')
				.select('*')
				.eq('id', id)
				.single()

			if (newsError) throw newsError

			// Récupérer l'artiste associé
			const { data: artist, error: artistError } = await supabase
				.from('artists')
				.select('*')
				.eq('id', news.artist_ids[0]) // On prend le premier artiste pour l'instant
				.single()

			if (artistError) throw artistError

			return {
				...news,
				artist,
			} as News
		} catch (error) {
			console.error('Erreur lors de la récupération des données de la news:', error)
			return null
		}
	}

	// Récupère une news par son ID (version légère)
	const getNewsByIdLight = async (id: string) => {
		const { data, error } = await supabase.from('news').select('*').eq('id', id).single()

		if (error) {
			console.error('Erreur lors de la récupération de la news:', error)
			return null
		}

		return data as News
	}

	// Récupère les dernières news ajoutées en temps réel
	const getRealtimeLastestNewsAdded = async (callback: (news: News[]) => void) => {
		// Obtenir la date du jour à minuit
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		// Récupération initiale des données
		const { data, error } = await supabase
			.from('news')
			.select(
				`
				*,
				artists:news_artists_junction!inner(
					artists!inner(*)
				)
			`,
			)
			.gte('date', today.toISOString())
			.order('date', { ascending: true })

		if (error) {
			console.error('Erreur lors de la récupération des dernières news:', error)
			return
		}

		// Transformer les données pour avoir directement les artistes
		const transformedData = data?.map((news) => ({
			...news,
			artists: news.artists?.map((artistJunction: any) => artistJunction.artists),
		}))

		// Appeler le callback avec les données transformées
		callback(transformedData as News[])

		// Mettre en place la souscription en temps réel
		const subscription = supabase
			.channel('news_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'news',
				},
				async (payload) => {
					// Récupérer à nouveau les données après un changement
					const { data: updatedData, error: updatedError } = await supabase
						.from('news')
						.select(
							`
							*,
							artists:news_artists_junction!inner(
								artists!inner(*)
							)
						`,
						)
						.gte('date', today.toISOString())
						.order('date', { ascending: false })

					if (!updatedError && updatedData) {
						// Transformer les données mises à jour
						const transformedUpdatedData = updatedData?.map((news) => ({
							...news,
							artists: news.artists?.map((artistJunction: any) => artistJunction.artists),
						}))
						callback(transformedUpdatedData as News[])
					}
				},
			)
			.subscribe()

		// Retourner la fonction de nettoyage
		return () => {
			subscription.unsubscribe()
		}
	}

	return {
		createNews,
		updateNews,
		deleteNews,
		getAllNews,
		getNewsById,
		getNewsByIdLight,
		getRealtimeLastestNewsAdded,
	}
}
