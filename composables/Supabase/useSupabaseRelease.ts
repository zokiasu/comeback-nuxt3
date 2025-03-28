import { useToast } from 'vue-toastification'
import { useSupabase } from './useSupabase'
import type { Release } from '~/types/supabase/release'
import type { QueryOptions, FilterOptions, ReleaseType } from '~/types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Artist } from '~/types/supabase/artist'

export function useSupabaseRelease() {
	const { supabase } = useSupabase() as { supabase: SupabaseClient }
	const toast = useToast()

	// Met à jour une release
	const updateRelease = async (id: string, updates: Partial<Release>) => {
		const { data, error } = await supabase
			.from('releases')
			.update(updates)
			.eq('id', id)
			.select()
			.single()

		if (error) {
			console.error('Erreur lors de la mise à jour de la release:', error)
			toast.error('Erreur lors de la mise à jour de la release')
			return null
		}

		return data as Release
	}

	const updateReleaseArtists = async (id: string, artistIds?: string[]) => {
		try {
			// 1. Supprimer toutes les relations existantes
			const { error: deleteError } = await supabase
				.from('artist_releases')
				.delete()
				.eq('release_id', id)

			if (deleteError) {
				console.error(
					'Erreur lors de la suppression des anciennes relations:',
					deleteError,
				)
				toast.error('Erreur lors de la mise à jour des artistes')
				throw deleteError
			}

			// 2. Ajouter les nouvelles relations si nécessaire
			if (artistIds && artistIds.length > 0) {
				const { error: insertError } = await supabase.from('artist_releases').insert(
					artistIds.map((artistId) => ({
						release_id: id,
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

	// Supprime une release
	const deleteRelease = async (id: string) => {
		// Supprimer d'abord les relations avec les artistes
		await supabase.from('artist_releases').delete().eq('release_id', id)

		// Supprimer les relations avec les musiques
		await supabase.from('music_releases').delete().eq('release_id', id)

		// Supprimer la release
		const { error } = await supabase.from('releases').delete().eq('id', id)

		if (error) {
			console.error('Erreur lors de la suppression de la release:', error)
			toast.error('Erreur lors de la suppression de la release')
			return false
		}

		return true
	}

	// Récupère toutes les releases
	const getAllReleases = async (options?: QueryOptions & FilterOptions) => {
		let query = supabase.from('releases').select('*')

		if (options?.search) {
			query = query.ilike('name', `%${options.search}%`)
		}

		if (options?.type) {
			query = query.eq('type', options.type as ReleaseType)
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
			console.error('Erreur lors de la récupération des releases:', error)
			return []
		}

		return data as Release[]
	}

	// Récupère une release avec tous ses détails
	const getReleaseById = async (id: string) => {
		if (!id) return null

		try {
			// Récupérer la release
			const { data: release, error: releaseError } = await supabase
				.from('releases')
				.select('*')
				.eq('id', id)
				.single()

			if (releaseError) throw releaseError

			// Récupérer les artistes associés
			const { data: artists, error: artistsError } = await supabase
				.from('artist_releases')
				.select(
					`
          artist:artists(*)
        `,
				)
				.eq('release_id', id)

			if (artistsError) throw artistsError

			// Récupérer les musiques associées
			const { data: musics, error: musicsError } = await supabase
				.from('music_releases')
				.select(
					`
          music:musics(*)
        `,
				)
				.eq('release_id', id)

			if (musicsError) throw musicsError

			return {
				...release,
				artists: artists?.map((a) => a.artist) || [],
				musics: musics?.map((m) => m.music) || [],
			} as Release
		} catch (error) {
			console.error('Erreur lors de la récupération des données de la release:', error)
			return null
		}
	}

	// Récupère une release par son ID (version légère)
	const getReleaseByIdLight = async (id: string) => {
		const { data, error } = await supabase
			.from('releases')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			console.error('Erreur lors de la récupération de la release:', error)
			return null
		}

		return data as Release
	}

	// Récupère les dernières releases ajoutées en temps réel
	const getRealtimeLastestReleasesAdded = async (
		limitNumber: number,
		callback: (releases: Release[]) => void,
	) => {
		const { data, error } = await supabase
			.from('releases')
			.select(
				`
				*,
				artist_releases!inner (
					artist:artists (
						id,
						name,
						image,
						type
					)
				)
			`,
			)
			.order('date', { ascending: false })
			.limit(limitNumber)

		if (error) {
			console.error('Erreur lors de la récupération des dernières releases:', error)
			return
		}

		// Transformer les données pour avoir un format plus simple à utiliser
		const transformedData = data.map((release) => ({
			...release,
			artists: release.artist_releases.map((ar: { artist: Artist }) => ar.artist),
		})) as Release[]

		callback(transformedData)
	}

	// Récupère les releases d'un mois et d'une année spécifiques
	const getReleasesByMonthAndYear = async (month: number, year: number) => {
		try {
			// Créer les dates de début et de fin du mois
			const startDate = new Date(year, month, 1)
			const endDate = new Date(year, month + 1, 0)

			const { data, error } = await supabase
				.from('releases')
				.select(
					`
					*,
					artists:artist_releases(
						artist:artists(*)
					)
				`,
				)
				.gte('date', startDate.toISOString())
				.lte('date', endDate.toISOString())
				.order('date', { ascending: true })

			if (error) {
				console.error('Erreur lors de la récupération des releases du mois:', error)
				toast.error('Erreur lors de la récupération des releases du mois')
				throw error
			}

			// Transformer les données pour avoir un format plus simple
			const formattedData = data.map((release) => ({
				...release,
				artists: release.artists?.map((ar: any) => ar.artist) || [],
			}))

			return formattedData as Release[]
		} catch (error) {
			console.error('Erreur lors de la récupération des releases du mois:', error)
			throw error
		}
	}

	return {
		updateRelease,
		updateReleaseArtists,
		deleteRelease,
		getAllReleases,
		getReleaseById,
		getReleaseByIdLight,
		getRealtimeLastestReleasesAdded,
		getReleasesByMonthAndYear,
	}
}
