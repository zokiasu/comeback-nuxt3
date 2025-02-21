import { Timestamp } from 'firebase/firestore'
import { type Release } from './release'

export interface Artist {
	id: string
	idYoutubeMusic: string
	name: string
	image: string
	description: string
	birthDate: Timestamp
	debutDate: Timestamp
	gender: 'UNKNOWN' | 'MALE' | 'FEMALE' | 'MIXTE'
	type: 'SOLO' | 'GROUP'
	verified: boolean
	activeCareer: boolean
	styles: {
		name: string
		created: Timestamp
	}[]
	generalTags: {
		name: string
		created: Timestamp
	}[]
	socialList: {
		name: string
		link: string
	}[]
	platformList: {
		name: string
		link: string
	}[]
	createdAt: Timestamp
	updatedAt: Timestamp
	members: Partial<Artist>[]
	groups: Partial<Artist>[]
	releases: Partial<Release>[]
}
