import type { Artist } from './artist'
import type { Music } from './music'
import type { BaseEntity, ReleaseType } from '.'

export interface Release extends BaseEntity {
	id_youtube_music: string
	name: string
	description: string | null
	date: string
	year: number
	type: ReleaseType
	verified: boolean
	image: string | 'https://i.ibb.co/wLhbFZx/Frame-255.png'
	artists?: Artist[]
	musics?: Music[]
}
