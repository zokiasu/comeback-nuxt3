import type { Artist } from './artist'
import type { Music } from './music'
import type { BaseEntity, ReleaseType } from '.'

export interface Release extends BaseEntity {
	firebase_id: string
	id_youtube_music: string
	name: string
	description: string | null
	release_date: string
	year: number
	type: ReleaseType
	verified: boolean
	image: string | 'https://i.ibb.co/wLhbFZx/Frame-255.png'
	artists?: Artist[]
	musics?: Music[]
}
