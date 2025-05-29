// Interface pour remplacer Firebase Timestamp
interface Timestamp {
	seconds: number
	nanoseconds: number
}

export interface Music {
	id: string
	title: string
	description: string
	imageURL?: string
	artist: string
	album?: string
	url?: string
	youtube_id?: string
	youtube_link?: string
	artists?: string[]
	release_id?: string
	createdAt: Timestamp
	updatedAt: Timestamp
}

export interface Artist {
	id: string
	name: string
	imageURL?: string
	description: string
	website?: string
	twitter?: string
	instagram?: string
	youtube?: string
	soundcloud?: string
	spotify?: string
	apple_music?: string
	deezer?: string
	createdAt: Timestamp
	updatedAt: Timestamp
}
