export type ArtistType = 'GROUP' | 'SOLO'
export type ArtistGender = 'MALE' | 'FEMALE' | 'MIXTE' | 'UNKNOWN'
export type ReleaseType = 'ALBUM' | 'SINGLE' | 'EP'
export type MusicType = 'SONG'
export type RelationType = 'GROUP' | 'MEMBER'

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
					release_date: string | null
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
					release_date?: string | null
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
					release_date?: string | null
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
					artist_ids: string[]
					verified: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					message: string
					date: string
					artist_ids: string[]
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					message?: string
					date?: string
					artist_ids?: string[]
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
		}
	}
}
