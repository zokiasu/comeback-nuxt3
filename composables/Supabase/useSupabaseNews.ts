import { useToast } from 'vue-toastification'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'
import type { News } from '~/types/supabase/news'
import type { QueryOptions, FilterOptions } from '~/types/supabase'

interface NewsResponse {
	news: News[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export function useSupabaseNews() {
	const { supabase } = useSupabase() as { supabase: SupabaseClient }
	const toast = useToast()

	// Crée une nouvelle news
	const createNews = async (
		data: Omit<News, 'id' | 'created_at' | 'updated_at' | 'artists'>,
		artistIds: string[],
	) => {
		if (!artistIds || artistIds.length === 0) {
			throw new Error('Les artistes sont requis pour créer une news')
		}

		if (!data.message) {
			throw new Error('Le message est requis pour créer une news')
		}

		const { data: news, error } = await supabase
			.from('news')
			.insert(data)
			.select(
				`
				*,
				news_artists_junction(
					artist_id
				)
			`,
			)
			.single()

		if (error) {
			console.error('Erreur lors de la création de la news:', error)
			toast.error('Erreur lors de la création de la news')
			throw new Error('Erreur lors de la création de la news')
		}

		const { data: junctionData, error: junctionError } = await supabase
			.from('news_artists_junction')
			.insert(
				artistIds.map((artistId) => ({
					news_id: news.id,
					artist_id: artistId,
				})),
			)
			.select()

		if (junctionError) {
			console.error('Erreur lors de la création des relations artistes:', junctionError)
			toast.error('Erreur lors de la création des relations artistes')
			throw new Error('Erreur lors de la création des relations artistes')
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

	const updateNewsArtistsRelations = async (id: string, artistIds?: string[]) => {
		try {
			// 1. Supprimer toutes les relations existantes pour cette news
			const { error: deleteError } = await supabase
				.from('news_artists_junction')
				.delete()
				.eq('news_id', id)

			if (deleteError) {
				console.error(
					'Erreur lors de la suppression des anciennes relations:',
					deleteError,
				)
				toast.error('Erreur lors de la mise à jour des artistes')
				throw deleteError
			}

			// 2. Si nous avons de nouveaux artistes à ajouter
			if (artistIds && artistIds.length > 0) {
				// Créer les nouvelles relations
				const { error: insertError } = await supabase
					.from('news_artists_junction')
					.insert(
						artistIds.map((artistId) => ({
							news_id: id,
							artist_id: artistId,
						})),
					)

				if (insertError) {
					console.error(
						'Erreur lors de la création des nouvelles relations:',
						insertError,
					)
					toast.error('Erreur lors de la mise à jour des artistes')
					throw insertError
				}
			}

			return true
		} catch (error) {
			console.error('Erreur lors de la mise à jour des artistes:', error)
			return false
		}
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
	const getAllNews = async (
		options?: QueryOptions & FilterOptions,
	): Promise<NewsResponse> => {
		let query = supabase.from('news').select(
			`
				*,
				artists:news_artists_junction(
					artists(*)
				),
				contributions:user_news_contributions(
					user:users(*)
				)
			`,
			{ count: 'exact' },
		)

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

		const { data, error, count } = await query

		if (error) {
			console.error('Erreur lors de la récupération des news:', error)
			return {
				news: [],
				total: 0,
				page: 1,
				limit: 10,
				totalPages: 1,
			}
		}

		// Transformer les données pour avoir directement les artistes et l'utilisateur
		const transformedData = data?.map((news) => ({
			...news,
			artists: news.artists?.map((artistJunction: any) => artistJunction.artists) || [],
			user: news.contributions?.[0]?.user || null,
		}))

		return {
			news: transformedData as News[],
			total: count || 0,
			page: options?.offset ? Math.floor(options.offset / (options.limit || 10)) + 1 : 1,
			limit: options?.limit || 10,
			totalPages: Math.ceil((count || 0) / (options?.limit || 10)),
		}
	}

	// Récupère une news avec tous ses détails
	const getNewsById = async (id: string) => {
		if (!id) return null

		const { data, error } = await supabase
			.from('news')
			.select(
				`
				*,
				artists:news_artists_junction(
					artists(*)
				)
			`,
			)
			.eq('id', id)
			.single()

		if (error) {
			console.error('Erreur lors de la récupération de la news:', error)
			return null
		}

		// Transformer la structure pour avoir directement les artistes
		if (data) {
			const transformedData = {
				...data,
				artists: data.artists?.map((item: any) => item.artists),
			}
			return transformedData as News
		}

		return null
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
			artists: news.artists?.map((artistJunction: any) => artistJunction.artists) || [],
		}))

		// Appeler le callback avec les données transformées
		callback(null, transformedData as News[])

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
							artists:
								news.artists?.map((artistJunction: any) => artistJunction.artists) || [],
						}))
						callback(null, transformedUpdatedData as News[])
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
		updateNewsArtistsRelations,
		deleteNews,
		getAllNews,
		getNewsById,
		getRealtimeLastestNewsAdded,
	}
}
