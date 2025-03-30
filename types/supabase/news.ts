import type { Artist } from './artist'
import type { BaseEntity } from '.'
import type { User } from './user'

export interface News extends BaseEntity {
	message: string
	date: string
	verified: boolean
	artists?: Artist[]
	user?: User | null
}
