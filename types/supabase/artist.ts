import type { Release } from './release'
import type {
	BaseEntity,
	ArtistGender,
	ArtistType,
	ArtistSocialLink,
	ArtistPlatformLink,
} from '.'

export interface Artist extends BaseEntity {
	firebase_id?: string
	id_youtube_music: string
	id: string
	name: string
	image: string | 'https://i.ibb.co/wLhbFZx/Frame-255.png'
	description: string | null
	birth_date: string | null
	debut_date: string | null
	gender: ArtistGender
	type: ArtistType
	verified: boolean
	active_career: boolean
	general_tags: string[] | null
	styles: string[] | null
	social_links: ArtistSocialLink[]
	platform_links: ArtistPlatformLink[]
	groups?: Artist[]
	members?: Artist[]
	releases?: Release[]
}
