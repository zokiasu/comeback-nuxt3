import { Timestamp } from 'firebase/firestore'
import type { Artist } from './artist'

export interface Comeback {
	id: string
	message: string
	verified: boolean
	date: Timestamp
	artist?: Pick<Artist, 'id' | 'name' | 'image'>
	artists?: Pick<Artist, 'id' | 'name' | 'image'>[]
	user: {
		id: string
		name: string
		picture: string
	}
	createdAt: Timestamp
	updatedAt: Timestamp
}
