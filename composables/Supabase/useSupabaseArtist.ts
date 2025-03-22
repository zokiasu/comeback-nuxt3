export const useUseSupabaseArtist = () => {
  return ref()
}
import { useToast } from 'vue-toastification'
import { useSupabase } from './useSupabase'
import type {
	QueryOptions,
	FilterOptions,
	ArtistType,
} from '~/types/supabase'
import type { Artist } from '~/types/supabase/artist'
import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseArtist() {
	const { supabase } = useSupabase() as { supabase: SupabaseClient }
	const toast = useToast()

	// Vérifie si un artiste existe avec l'ID YouTube Music
	const artistExistInSupabase = async (
		idYoutubeMusic: string | null,
	): Promise<boolean> => {
		if (!idYoutubeMusic) return false

		const { data, error } = await supabase
			.from('artists')
			.select('id')
			.eq('id_youtube_music', idYoutubeMusic)
			.single()

		if (error) {
			console.error("Erreur lors de la vérification de l'artiste:", error)
			throw new Error("Erreur lors de la vérification de l'artiste")
		}

		return !!data
	}

	// Crée un nouvel artiste
	const createArtist = async (data: Omit<Artist, 'id' | 'created_at' | 'updated_at'>) => {
		if (data.id_youtube_music && (await artistExistInSupabase(data.id_youtube_music))) {
			toast.error('Cet artiste existe déjà dans la base de données.')
			throw new Error('Cet artiste existe déjà dans la base de données.')
		}

		const { data: artist, error } = await supabase
			.from('artists')
			.insert(data)
			.select()
			.single()

		if (error) {
			console.error("Erreur lors de la création de l'artiste:", error)
			throw new Error("Erreur lors de la création de l'artiste")
		}

		return artist as Artist
	}

	// Met à jour un artiste
	const updateArtist = async (idYoutubeMusic: string, updates: Partial<Artist>) => {
		const { data, error } = await supabase
			.from('artists')
			.update(updates)
			.eq('id_youtube_music', idYoutubeMusic)
			.select()
			.single()

		if (error) {
			console.error("Erreur lors de la mise à jour de l'artiste:", error)
			throw new Error("Erreur lors de la mise à jour de l'artiste")
		}

		return data as Artist
	}

	// Supprime un artiste
	const deleteArtist = async (id: string) => {
		// Supprimer d'abord les relations
		await supabase
			.from('artist_relations')
			.delete()
			.or(`group_id.eq.${id},member_id.eq.${id}`)

		// Supprimer les releases associées
		const { data: releases } = await supabase
			.from('artist_releases')
			.select('release_id')
			.eq('artist_id', id)

		if (releases) {
			await supabase
				.from('releases')
				.delete()
				.in(
					'id',
					releases.map((r) => r.release_id),
				)
		}

		// Supprimer l'artiste
		const { error } = await supabase.from('artists').delete().eq('id', id)

		if (error) {
			console.error("Erreur lors de la suppression de l'artiste:", error)
			throw new Error("Erreur lors de la suppression de l'artiste")
		}

		return true
	}

	// Récupère tous les artistes
	const getAllArtists = async (options?: QueryOptions & FilterOptions) => {
		let query = supabase.from('artists').select('*')

		if (options?.search) {
			query = query.ilike('name', `%${options.search}%`)
		}

		if (options?.isActive !== undefined) {
			query = query.eq('active_career', options.isActive)
		}

		if (options?.verified !== undefined) {
			query = query.eq('verified', options.verified)
		}

		if (options?.type) {
			query = query.eq('type', options.type as ArtistType)
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
			console.error('Erreur lors de la récupération des artistes:', error)
			throw new Error('Erreur lors de la récupération des artistes')
		}

		return data as Artist[]
	}

	// Récupère un artiste avec tous ses détails
	const getFullArtistById = async (id: string) => {
		if (!id) return null

		try {
			// Récupérer l'artiste
			const { data: artist, error: artistError } = await supabase
				.from('artists')
				.select('*')
				.eq('id', id)
				.single()

			if (artistError) throw artistError

			// Récupérer les groupes (relations où l'artiste est membre)
			const { data: groups, error: groupsError } = await supabase
				.from('artist_relations')
				.select(
					`
          group:artists!artist_relations_group_id_fkey(*)
        `,
				)
				.eq('member_id', id)

			if (groupsError) throw groupsError

			// Récupérer les membres (relations où l'artiste est groupe)
			const { data: members, error: membersError } = await supabase
				.from('artist_relations')
				.select(
					`
          member:artists!artist_relations_member_id_fkey(*)
        `,
				)
				.eq('group_id', id)

			if (membersError) throw membersError

			// Récupérer les releases
			const { data: releases, error: releasesError } = await supabase
				.from('artist_releases')
				.select(
					`
          release:releases(*)
        `,
				)
				.eq('artist_id', id)

			if (releasesError) throw releasesError

			return {
				...artist,
				groups: groups?.map((g) => g.group) || [],
				members: members?.map((m) => m.member) || [],
				releases: releases?.map((r) => r.release) || [],
			} as Artist
		} catch (error) {
			console.error("Erreur lors de la récupération des données de l'artiste:", error)
			throw new Error("Erreur lors de la récupération des données de l'artiste")
		}
	}

	// Récupère un artiste par son ID (version légère)
	const getArtistByIdLight = async (id: string) => {
		const { data, error } = await supabase
			.from('artists')
			.select('*')
			.eq('id', id)
			.single()

		if (error) {
			console.error("Erreur lors de la récupération de l'artiste:", error)
			throw new Error("Erreur lors de la récupération de l'artiste")
		}

		return data as Artist
	}

	// Récupère les derniers artistes ajoutés en temps réel
	const getRealtimeLastestArtistsAdded = async (
		limitNumber: number,
		callback: (artists: Artist[]) => void,
	) => {
		const { data, error } = await supabase
			.from('artists')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(limitNumber)

		if (error) {
			console.error('Erreur lors de la récupération des derniers artistes:', error)
			throw new Error('Erreur lors de la récupération des derniers artistes')
		}

		callback(data as Artist[])
	}

	return {
		artistExistInSupabase,
		createArtist,
		updateArtist,
		deleteArtist,
		getAllArtists,
		getFullArtistById,
		getArtistByIdLight,
		getRealtimeLastestArtistsAdded,
	}
}
