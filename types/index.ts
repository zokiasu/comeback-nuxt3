// Types de base
export interface BaseEntity {
	id: string
	created_at: string
	updated_at: string
}

// Types d'énumération
export type ArtistType = 'GROUP' | 'SOLO'
export type ArtistGender = 'MALE' | 'FEMALE' | 'MIXTE' | 'UNKNOWN'
export type ReleaseType = 'ALBUM' | 'SINGLE' | 'EP'
export type MusicType = 'SONG'
export type RelationType = 'GROUP' | 'MEMBER'

// Types pour les artistes
export interface Artist extends BaseEntity {
	firebase_id: string
	id_youtube_music: string | null
	name: string
	image: string | 'https://i.ibb.co/wLhbFZx/Frame-255.png'
	description: string | null
	birth_date: string | null
	debut_date: string | null
	gender: ArtistGender | null
	type: ArtistType | null
	verified: boolean
	active_career: boolean
	groups?: Artist[]
	members?: Artist[]
	releases?: Release[]
}

// Types pour les releases
export interface Release extends BaseEntity {
	firebase_id: string
	id_youtube_music: string | null
	name: string
	description: string | null
	release_date: string | null
	year: number | null
	type: ReleaseType | null
	verified: boolean
	image: string | 'https://i.ibb.co/wLhbFZx/Frame-255.png'
	artists?: Artist[]
	musics?: Music[]
}

// Types pour les musiques
export interface Music extends BaseEntity {
	firebase_id: string
	id_youtube_music: string | null
	name: string
	description: string | null
	duration: number | null
	type: MusicType | null
	verified: boolean
	thumbnails: { url: string; width: number; height: number }[] | null
	artists?: Artist[]
	releases?: Release[]
}

// Types pour les news
export interface News extends BaseEntity {
	message: string
	date: string
	artist_ids: string[]
	verified: boolean
	artists: Artist[]
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
