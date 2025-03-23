import type { Artist } from './artist'
import type { BaseEntity } from '.'

export interface News extends BaseEntity {
	message: string
	date: string
	verified: boolean
	artists?: Artist[]
}
