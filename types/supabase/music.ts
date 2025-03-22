import type { Artist } from './artist'
import type { Release } from './release'
import type { BaseEntity, MusicType } from '.'

export interface Music extends BaseEntity {
	firebase_id: string
	id_youtube_music: string
	name: string
	description: string | null
	duration: number | null
	type: MusicType
	verified: boolean
	thumbnails: { url: string; width: number; height: number }[] | null
	artists?: Artist[]
	releases?: Release[]
}
