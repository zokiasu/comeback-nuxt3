import type {
	QueryOptions,
	FilterOptions,
	ArtistType,
	ArtistSocialLink,
	ArtistPlatformLink,
} from '~/types/supabase'
import type { Artist } from '~/types'
import { useGeneralFunction } from '@/composables/useGeneralFunction'
import { useSupabaseClient } from '#imports'

export function useSupabaseArtist() {
	const supabase = useSupabaseClient()
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
			.maybeSingle()

		if (error) {
			console.error("Erreur lors de la vérification de l'artiste:", error)
			throw new Error("Erreur lors de la vérification de l'artiste")
		}

		return !!data
	}

	// Crée un nouvel artiste
	const createArtist = async (
		data: Omit<
			Artist,
			'id' | 'created_at' | 'updated_at' | 'social_links' | 'platform_links'
		>,
		artistSocials: Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[],
		artistPlatforms: Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[],
		artistGroups: Artist[],
		artistMembers: Artist[],
	) => {
		if (data.id_youtube_music && (await artistExistInSupabase(data.id_youtube_music))) {
			toast.add({
				title: 'Cet artiste existe déjà dans la base de données.',
				color: 'error',
			})
			console.error('Cet artiste existe déjà dans la base de données.')
			throw new Error('Cet artiste existe déjà dans la base de données.')
		}

		const { data: artist, error } = await supabase
			.from('artists')
			.insert(data)
			.select()
			.single()

		if (error) {
			toast.add({
				title: "Erreur lors de la création de l'artiste",
				color: 'error',
			})
			console.error("Erreur lors de la création de l'artiste:", error)
			throw new Error("Erreur lors de la création de l'artiste")
		}

		// Ajout des liens sociaux
		if (artistSocials?.length) {
			const socialLinksWithArtistId = artistSocials.map((link) => ({
				...link,
				artist_id: artist.id,
			}))

			const { error: socialError } = await supabase
				.from('artist_social_links')
				.insert(socialLinksWithArtistId)

			if (socialError) {
				console.error("Erreur lors de l'ajout des liens sociaux:", socialError)
			}
		}

		// Ajout des liens de plateformes
		if (artistPlatforms?.length) {
			const platformLinksWithArtistId = artistPlatforms.map((link) => ({
				...link,
				artist_id: artist.id,
			}))

			const { error: platformError } = await supabase
				.from('artist_platform_links')
				.insert(platformLinksWithArtistId)

			if (platformError) {
				console.error("Erreur lors de l'ajout des liens de plateformes:", platformError)
			}
		}

		// Ajout des relations avec les groupes (artiste comme membre)
		if (artistGroups?.length) {
			const groupRelations = artistGroups.map((group) => ({
				group_id: group.id,
				member_id: artist.id,
				relation_type: 'MEMBER',
			}))

			const { error: groupError } = await supabase
				.from('artist_relations')
				.insert(groupRelations)

			if (groupError) {
				console.error("Erreur lors de l'ajout des relations de groupe:", groupError)
			}
		}

		// Ajout des relations avec les membres (artiste comme groupe)
		if (artistMembers?.length) {
			const memberRelations = artistMembers.map((member) => ({
				group_id: artist.id,
				member_id: member.id,
				relation_type: 'GROUP',
			}))

			const { error: memberError } = await supabase
				.from('artist_relations')
				.insert(memberRelations)

			if (memberError) {
				console.error("Erreur lors de l'ajout des relations de membres:", memberError)
			}
		}

		return artist as Artist
	}

	// Met à jour un artiste
	const updateArtist = async (
		artistId: string,
		updates: Partial<Artist>,
		socialLinks?: Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[],
		platformLinks?: Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[],
		artistGroups?: Artist[],
		artistMembers?: Artist[],
	) => {
		const { data: artist, error } = await supabase
			.from('artists')
			.update(updates)
			.eq('id', artistId)
			.select()
			.single()

		if (error) {
			console.error("Erreur lors de la mise à jour de l'artiste:", error)
			throw new Error("Erreur lors de la mise à jour de l'artiste")
		}

		// Supprimer les anciens liens sociaux
		await supabase.from('artist_social_links').delete().eq('artist_id', artist.id)

		// Ajouter les nouveaux liens sociaux
		if (socialLinks?.length) {
			const socialLinksWithArtistId = socialLinks.map((link) => ({
				...link,
				artist_id: artist.id,
			}))

			const { error: socialError } = await supabase
				.from('artist_social_links')
				.insert(socialLinksWithArtistId)

			if (socialError) {
				console.error("Erreur lors de l'ajout des liens sociaux:", socialError)
			}
		}

		// Supprimer les anciens liens de plateformes
		await supabase.from('artist_platform_links').delete().eq('artist_id', artist.id)

		// Ajouter les nouveaux liens de plateformes
		if (platformLinks?.length) {
			const platformLinksWithArtistId = platformLinks.map((link) => ({
				...link,
				artist_id: artist.id,
			}))

			const { error: platformError } = await supabase
				.from('artist_platform_links')
				.insert(platformLinksWithArtistId)

			if (platformError) {
				console.error("Erreur lors de l'ajout des liens de plateformes:", platformError)
			}
		}

		// Supprimer les anciennes relations
		await supabase
			.from('artist_relations')
			.delete()
			.or(`group_id.eq.${artist.id},member_id.eq.${artist.id}`)

		// Ajouter les nouvelles relations avec les groupes
		if (artistGroups?.length) {
			const groupRelations = artistGroups.map((group) => ({
				group_id: group.id,
				member_id: artist.id,
				relation_type: 'MEMBER',
			}))

			const { error: groupError } = await supabase
				.from('artist_relations')
				.insert(groupRelations)

			if (groupError) {
				console.error("Erreur lors de l'ajout des relations de groupe:", groupError)
			}
		}

		// Ajouter les nouvelles relations avec les membres
		if (artistMembers?.length) {
			const memberRelations = artistMembers.map((member) => ({
				group_id: artist.id,
				member_id: member.id,
				relation_type: 'GROUP',
			}))

			const { error: memberError } = await supabase
				.from('artist_relations')
				.insert(memberRelations)

			if (memberError) {
				console.error("Erreur lors de l'ajout des relations de membres:", memberError)
			}
		}

		return artist as Artist
	}

	// Supprime un artiste et toutes ses relations
	const deleteArtist = async (id: string) => {
		try {
			// 1. Récupérer toutes les releases associées à l'artiste
			const { data: artistReleases } = await supabase
				.from('artist_releases')
				.select('release_id')
				.eq('artist_id', id)

			// 2. Récupérer toutes les musiques associées à l'artiste
			const { data: artistMusics } = await supabase
				.from('music_artists')
				.select('music_id')
				.eq('artist_id', id)

			// 3. Récupérer toutes les news associées à l'artiste
			const { data: artistNews } = await supabase
				.from('news_artists_junction')
				.select('news_id')
				.eq('artist_id', id)

			// 4. Supprimer les liens sociaux
			await supabase.from('artist_social_links').delete().eq('artist_id', id)

			// 5. Supprimer les liens de plateformes
			await supabase.from('artist_platform_links').delete().eq('artist_id', id)

			// 6. Supprimer les relations entre artistes
			await supabase
				.from('artist_relations')
				.delete()
				.or(`group_id.eq.${id},member_id.eq.${id}`)

			if (artistMusics?.length) {
				const musicIds = artistMusics.map((m) => m.music_id)

				// 7. Supprimer les relations musiques-releases pour ces musiques
				await supabase.from('music_releases').delete().in('music_id', musicIds)

				// 8. Supprimer les relations musiques-artistes pour ces musiques
				await supabase.from('music_artists').delete().in('music_id', musicIds)

				// 9. Supprimer les musiques
				await supabase.from('musics').delete().in('id', musicIds)
			}

			if (artistReleases?.length) {
				const releaseIds = artistReleases.map((r) => r.release_id)

				// 10. Supprimer les relations artistes-releases pour ces releases
				await supabase.from('artist_releases').delete().in('release_id', releaseIds)

				// 11. Supprimer les relations musiques-releases pour ces releases
				await supabase.from('music_releases').delete().in('release_id', releaseIds)

				// 12. Supprimer les releases
				await supabase.from('releases').delete().in('id', releaseIds)
			}

			if (artistNews?.length) {
				const newsIds = artistNews.map((n) => n.news_id)

				// 13. Supprimer les relations news-artistes pour ces news
				await supabase.from('news_artists_junction').delete().in('news_id', newsIds)

				// 14. Supprimer les news
				await supabase.from('news').delete().in('id', newsIds)
			}

			// 15. Finalement, supprimer l'artiste
			const { error } = await supabase.from('artists').delete().eq('id', id)

			if (error) {
				console.error("Erreur lors de la suppression de l'artiste:", error)
				throw new Error("Erreur lors de la suppression de l'artiste")
			}

			return true
		} catch (error) {
			console.error("Erreur lors de la suppression de l'artiste et ses données:", error)
			throw error
		}
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

	const getAllArtistsLight = async () => {
		const { data, error } = await supabase.from('artists').select('*')
		if (error) {
			console.error('Erreur lors de la récupération des artistes:', error)
			throw new Error('Erreur lors de la récupération des artistes')
		}
		return data as Artist[]
	}

	// Récupère un artiste avec tous ses détails
	const getFullArtistById = async (id: string): Promise<Artist> => {
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

	const getSocialAndPlatformLinksByArtistId = async (id: string) => {
		const { data: socialLinks, error: socialLinksError } = await supabase
			.from('artist_social_links')
			.select('*')
			.eq('artist_id', id)

		if (socialLinksError) throw socialLinksError

		const { data: platformLinks, error: platformLinksError } = await supabase
			.from('artist_platform_links')
			.select('*')
			.eq('artist_id', id)

		if (platformLinksError) throw platformLinksError

		return {
			socialLinks: socialLinks || [],
			platformLinks: platformLinks || [],
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

	// Récupère les artistes par page avec pagination
	const getArtistsByPage = async (
		page: number,
		limit: number,
		options?: {
			search?: string
			type?: ArtistType
			orderBy?: keyof Artist
			orderDirection?: 'asc' | 'desc'
			general_tags?: string[]
			styles?: string[]
			gender?: string
		},
	) => {
		try {
			// Calculer l'offset
			const offset = (page - 1) * limit

			// Construire la requête de base avec les relations
			let query = supabase.from('artists').select(
				`
					*,
					social_links:artist_social_links(*),
					platform_links:artist_platform_links(*)
				`,
				{ count: 'exact' },
			)

			// Ajouter les filtres si présents
			if (options?.search) {
				query = query.ilike('name', `%${options.search}%`)
			}

			if (options?.type) {
				query = query.eq('type', options.type)
			}

			// Filtrage par gender
			if (options?.gender) {
				query = query.eq('gender', options.gender)
			}

			// Filtrage par tags (OU)
			if (options?.general_tags && options.general_tags.length > 0) {
				query = query.overlaps('general_tags', options.general_tags)
			}

			// Filtrage par styles (OU)
			if (options?.styles && options.styles.length > 0) {
				query = query.overlaps('styles', options.styles)
			}

			// Ajout du filtre actif/inactif
			if (options?.isActive === true) {
				query = query.eq('active_career', true)
			} else if (options?.isActive === false) {
				query = query.or('active_career.is.false,active_career.is.null')
			}

			// Ajouter le tri
			if (options?.orderBy) {
				query = query.order(options.orderBy, {
					ascending: options.orderDirection === 'asc',
				})
			} else {
				query = query.order('name')
			}

			// Ajouter la pagination
			query = query.range(offset, offset + limit - 1)

			// Exécuter la requête
			const { data, error, count } = await query

			if (error) {
				console.error('Erreur lors de la récupération des artistes:', error)
				throw new Error('Erreur lors de la récupération des artistes')
			}

			// Transformer les données pour correspondre au format attendu
			const transformedData = data.map((artist) => ({
				...artist,
				social_links: artist.social_links || [],
				platform_links: artist.platform_links || [],
			}))

			return {
				artists: transformedData as Artist[],
				total: count || 0,
				page,
				limit,
				totalPages: Math.ceil((count || 0) / limit),
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des artistes:', error)
			throw error
		}
	}

	return {
		artistExistInSupabase,
		createArtist,
		updateArtist,
		deleteArtist,
		getAllArtists,
		getAllArtistsLight,
		getFullArtistById,
		getArtistByIdLight,
		getRealtimeLastestArtistsAdded,
		getSocialAndPlatformLinksByArtistId,
		getArtistsByPage,
	}
}
