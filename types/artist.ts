import { Timestamp } from 'firebase/firestore'
import { type Release } from './release'

export interface Artist {
	id: string
	idYoutubeMusic?: string
	name: string
	image?: string
	description?: string
	birthDate?: Timestamp
	debutDate?: Timestamp
	gender?: string
	type?: string
	verified?: boolean
	activeCareer?: boolean
	styles?: any[]
	generalTags?: any[]
	socialList?: {
		name: string
		link: string
	}[]
	platformList?: {
		name: string
		link: string
	}[]
	createdAt?: Timestamp
	updatedAt?: Timestamp
	members?: Partial<Artist>[]
	groups?: Partial<Artist>[]
	releases?: Partial<Release>[]
}
