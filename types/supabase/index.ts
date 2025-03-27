import type { Artist } from './artist'
import type { Music } from './music'
import type { News } from './news'
import type { Release } from './release'
import type { User } from './user'
import type { GeneralTag } from './general_tag'
import type { MusicStyle } from './music_style'

export type ArtistType = 'GROUP' | 'SOLO'
export type ArtistGender = 'MALE' | 'FEMALE' | 'MIXTE' | 'UNKNOWN' | 'OTHER'
export type ReleaseType = 'ALBUM' | 'SINGLE' | 'EP'
export type MusicType = 'SONG'
export type RelationType = 'GROUP' | 'MEMBER'
export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER'

export interface Database {
	public: {
		Tables: {
			artists: {
				Row: {
					id: string
					firebase_id: string
					id_youtube_music: string | null
					name: string
					image: string | null
					description: string | null
					birth_date: string | null
					debut_date: string | null
					gender: ArtistGender | null
					type: ArtistType | null
					verified: boolean
					active_career: boolean
					general_tags: string[] | null
					styles: string[] | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					firebase_id: string
					id_youtube_music?: string | null
					name: string
					image?: string | null
					description?: string | null
					birth_date?: string | null
					debut_date?: string | null
					gender?: ArtistGender | null
					type?: ArtistType | null
					verified?: boolean
					active_career?: boolean
					general_tags?: string[] | null
					styles?: string[] | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					firebase_id?: string
					id_youtube_music?: string | null
					name?: string
					image?: string | null
					description?: string | null
					birth_date?: string | null
					debut_date?: string | null
					gender?: ArtistGender | null
					type?: ArtistType | null
					verified?: boolean
					active_career?: boolean
					general_tags?: string[] | null
					styles?: string[] | null
					created_at?: string
					updated_at?: string
				}
			}
			releases: {
				Row: {
					id: string
					firebase_id: string
					id_youtube_music: string | null
					name: string
					description: string | null
					date: string | null
					year: number | null
					type: ReleaseType | null
					verified: boolean
					image: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					firebase_id: string
					id_youtube_music?: string | null
					name: string
					description?: string | null
					date?: string | null
					year?: number | null
					type?: ReleaseType | null
					verified?: boolean
					image?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					firebase_id?: string
					id_youtube_music?: string | null
					name?: string
					description?: string | null
					date?: string | null
					year?: number | null
					type?: ReleaseType | null
					verified?: boolean
					image?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			musics: {
				Row: {
					id: string
					firebase_id: string
					id_youtube_music: string | null
					name: string
					description: string | null
					duration: number | null
					type: MusicType | null
					verified: boolean
					thumbnails: { url: string; width: number; height: number }[] | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					firebase_id: string
					id_youtube_music?: string | null
					name: string
					description?: string | null
					duration?: number | null
					type?: MusicType | null
					verified?: boolean
					thumbnails?: { url: string; width: number; height: number }[] | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					firebase_id?: string
					id_youtube_music?: string | null
					name?: string
					description?: string | null
					duration?: number | null
					type?: MusicType | null
					verified?: boolean
					thumbnails?: { url: string; width: number; height: number }[] | null
					created_at?: string
					updated_at?: string
				}
			}
			news: {
				Row: {
					id: string
					message: string
					date: string
					verified: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					message: string
					date: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					message?: string
					date?: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
			}
			artist_releases: {
				Row: {
					artist_id: string
					release_id: string
					is_primary: boolean
					created_at: string
				}
				Insert: {
					artist_id: string
					release_id: string
					is_primary?: boolean
					created_at?: string
				}
				Update: {
					artist_id?: string
					release_id?: string
					is_primary?: boolean
					created_at?: string
				}
			}
			artist_relations: {
				Row: {
					group_id: string
					member_id: string
					relation_type: RelationType | null
					created_at: string
				}
				Insert: {
					group_id: string
					member_id: string
					relation_type?: RelationType | null
					created_at?: string
				}
				Update: {
					group_id?: string
					member_id?: string
					relation_type?: RelationType | null
					created_at?: string
				}
			}
      artist_social_links: {
        Row: {
          id: string
          artist_id: string
          link: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          link: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          link?: string
          name?: string
          created_at?: string
        }
      }
      artist_platform_links: {
        Row: {
          id: string
          artist_id: string
          link: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          link: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          link?: string
          name?: string
          created_at?: string
        }
      }
			music_artists: {
				Row: {
					music_id: string
					artist_id: string
					is_primary: boolean
					created_at: string
				}
				Insert: {
					music_id: string
					artist_id: string
					is_primary?: boolean
					created_at?: string
				}
				Update: {
					music_id?: string
					artist_id?: string
					is_primary?: boolean
					created_at?: string
				}
			}
			music_releases: {
				Row: {
					music_id: string
					release_id: string
					track_number: number
					created_at: string
				}
				Insert: {
					music_id: string
					release_id: string
					track_number: number
					created_at?: string
				}
				Update: {
					music_id?: string
					release_id?: string
					track_number?: number
					created_at?: string
				}
			}
			news_artists_junction: {
				Row: {
					news_id: string
					artist_id: string
				}
				Insert: {
					news_id: string
					artist_id: string
				}
				Update: {
					news_id?: string
					artist_id?: string
				}
			}
			user_artist_contributions: {
				Row: {
					user_id: string
					artist_id: string
					created_at: string
					contribution_type: string
				}
				Insert: {
					user_id: string
					artist_id: string
					contribution_type: string
				}
				Update: {
					user_id?: string
					artist_id?: string
					contribution_type?: string
				}
			}
			user_news_contributions: {
				Row: {
					user_id: string
					news_id: string
					created_at: string
					contribution_type: string
				}
				Insert: {
					user_id: string
					news_id: string
					contribution_type: string
				}
				Update: {
					user_id?: string
					news_id?: string
					contribution_type?: string
				}
			}
			general_tags: {
				Row: GeneralTag
				Insert: Omit<GeneralTag, 'id' | 'created_at' | 'updated_at'>
				Update: Partial<GeneralTag>
			}
			music_styles: {
				Row: MusicStyle
				Insert: Omit<MusicStyle, 'id' | 'created_at' | 'updated_at'>
				Update: Partial<MusicStyle>
			}
		}
	}
}

// Types de base
export interface BaseEntity {
	id: string
	created_at: string
	updated_at: string
}

// Types pour les relations
export interface ArtistRelation {
	group_id: string
	member_id: string
	relation_type: RelationType | null
	created_at: string
	group?: Artist
	member?: Artist
}

export interface ArtistRelease {
	artist_id: string
	release_id: string
	is_primary: boolean
	created_at: string
	artist?: Artist
	release?: Release
}

export interface ArtistPlatformLink {
	id: string
	artist_id: string
	link: string
	name: string
	created_at: string
}

export interface ArtistSocialLink {
	id: string
	artist_id: string
	link: string
	name: string
	created_at: string
}

export interface MusicArtist {
	music_id: string
	artist_id: string
	is_primary: boolean
	created_at: string
	music?: Music
	artist?: Artist
}

export interface MusicRelease {
	music_id: string
	release_id: string
	track_number: number
	created_at: string
	music?: Music
	release?: Release
}

export interface NewsArtistJunction {
	artist_id: string
	news_id: string
	artist?: Artist
	news?: News
}

export interface UserArtistContribution {
	user_id: string
	artist_id: string
	created_at: string
	contribution_type: string
	user?: User
	artist?: Artist
}

export interface UserNewsContribution {
	user_id: string
	news_id: string
	created_at: string
	contribution_type: string
	user?: User
	news?: News
}

// Types pour les réponses Supabase
export interface SupabaseResponse<T> {
	data: T | null
	error: any | null
}

// Types pour les options de requête
export interface QueryOptions {
	limit?: number
	offset?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
}

// Types pour les filtres
export interface FilterOptions {
	search?: string
	isActive?: boolean
	startDate?: string
	endDate?: string
	type?: string
	verified?: boolean
}
