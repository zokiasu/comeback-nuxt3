import { useToast } from 'vue-toastification'
import { useSupabase } from './useSupabase'
import type {
	QueryOptions,
	FilterOptions,
	MusicType,
} from '~/types/supabase'
import type { Music } from '~/types/supabase/music'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseMusic() {
	const { supabase } = useSupabase() as { supabase: SupabaseClient }
	const toast = useToast()

	// Met à jour une musique
	const updateMusic = async (id: string, updates: Partial<Music>) => {
		const { data, error } = await supabase
			.from('musics')
			.update(updates)
			.eq('id', id)
			.select()
			.single()

		if (error) {
			console.error('Erreur lors de la mise à jour de la musique:', error)
			toast.error('Erreur lors de la mise à jour de la musique')
			return null
		}

		return data as Music
	}

	const updateMusicArtists = async (id: string, artistIds?: string[]) => {
		try {
			// 1. Supprimer toutes les relations existantes
			const { error: deleteError } = await supabase
				.from('music_artists')
				.delete()
				.eq('music_id', id)

			if (deleteError) {
				console.error('Erreur lors de la suppression des anciennes relations:', deleteError)
				toast.error('Erreur lors de la mise à jour des artistes')
				throw deleteError
			}

			// 2. Ajouter les nouvelles relations si nécessaire
			if (artistIds && artistIds.length > 0) {
				const { error: insertError } = await supabase.from('music_artists').insert(
					artistIds.map((artistId) => ({
						music_id: id,
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
		} catch (error) {
			console.error('Erreur lors de la mise à jour des artistes:', error)
			return false
		}
	}

	const updateMusicReleases = async (id: string, releaseIds?: string[]) => {
		try {
			// 1. Supprimer toutes les relations existantes
			const { error: deleteError } = await supabase
				.from('music_releases')
				.delete()
				.eq('music_id', id)

			if (deleteError) {
				console.error('Erreur lors de la suppression des anciennes relations:', deleteError)
				toast.error('Erreur lors de la mise à jour des releases')
				throw deleteError
			}

			// 2. Ajouter les nouvelles relations si nécessaire
			if (releaseIds && releaseIds.length > 0) {
				const { error: insertError } = await supabase.from('music_releases').insert(
					releaseIds.map((releaseId) => ({
						music_id: id,
						release_id: releaseId,
					})),
				)

				if (insertError) {
					console.error('Erreur lors de la création des nouvelles relations:', insertError)
					toast.error('Erreur lors de la mise à jour des releases')
					throw insertError
				}
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour des releases:', error)
			return false
		}
	}

	// Supprime une musique
	const deleteMusic = async (id: string) => {
		// Supprimer d'abord les relations avec les artistes
		await supabase.from('music_artists').delete().eq('music_id', id)

		// Supprimer les relations avec les releases
		await supabase.from('music_releases').delete().eq('music_id', id)

		// Supprimer la musique
		const { error } = await supabase.from('musics').delete().eq('id', id)

		if (error) {
			console.error('Erreur lors de la suppression de la musique:', error)
			toast.error('Erreur lors de la suppression de la musique')
			return false
		}

		return true
	}

	// Récupère toutes les musiques
	const getAllMusics = async (options?: QueryOptions & FilterOptions) => {
		let query = supabase.from('musics').select('*')

		if (options?.search) {
			query = query.ilike('name', `%${options.search}%`)
		}

		if (options?.type) {
			query = query.eq('type', options.type as MusicType)
		}

		if (options?.verified !== undefined) {
			query = query.eq('verified', options.verified)
		}

		if (options?.orderBy) {
			query = query.order(options.orderBy, {
				ascending: options.orderDirection === 'asc',
			})
		} else {
			query = query.order('name')
		}

		if (options?.limit) {
			query = query.limit(options.limit)
		}

		if (options?.offset) {
			query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
		}

		const { data, error } = await query

		if (error) {
			console.error('Erreur lors de la récupération des musiques:', error)
			return []
		}

		return data as Music[]
	}

	// Récupère une musique avec tous ses détails
	const getMusicById = async (id: string) => {
		if (!id) return null

		try {
			// Récupérer la musique
			const { data: music, error: musicError } = await supabase
				.from('musics')
				.select('*')
				.eq('id', id)
				.single()

			if (musicError) throw musicError

			// Récupérer les artistes associés
			const { data: artists, error: artistsError } = await supabase
				.from('music_artists')
				.select(
					`
          artist:artists(*)
        `,
				)
				.eq('music_id', id)

			if (artistsError) throw artistsError

			// Récupérer les releases associées
			const { data: releases, error: releasesError } = await supabase
				.from('music_releases')
				.select(
					`
          release:releases(*)
        `,
				)
				.eq('music_id', id)

			if (releasesError) throw releasesError

			return {
				...music,
				artists: artists?.map((a) => a.artist) || [],
				releases: releases?.map((r) => r.release) || [],
			} as Music
		} catch (error) {
			console.error('Erreur lors de la récupération des données de la musique:', error)
			return null
		}
	}

	// Récupère une musique par son ID (version légère)
	const getMusicByIdLight = async (id: string) => {
		const { data, error } = await supabase
			.from('musics')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			console.error('Erreur lors de la récupération de la musique:', error)
			return null
		}

		return data as Music
	}

	// Récupère les dernières musiques ajoutées en temps réel
	const getRealtimeLastestMusicsAdded = async (
		limitNumber: number,
		callback: (musics: Music[]) => void,
	) => {
		const { data, error } = await supabase
			.from('musics')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(limitNumber)

		if (error) {
			console.error('Erreur lors de la récupération des dernières musiques:', error)
			return
		}

		callback(data as Music[])
	}

	return {
		updateMusic,
		updateMusicArtists,
		updateMusicReleases,
		deleteMusic,
		getAllMusics,
		getMusicById,
		getMusicByIdLight,
		getRealtimeLastestMusicsAdded,
	}
}
