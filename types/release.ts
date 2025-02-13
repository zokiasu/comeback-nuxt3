import type { Timestamp } from 'firebase/firestore'
import { type Artist } from './artist'
import { type Music } from './music'

export interface Release {
	id: string
	idYoutubeMusic: string
	name: string
	type: string
	year: number
	needToBeVerified: boolean
	platformList: {
		name: string
		link: string
	}[]
	date: Timestamp
	image?: string
	artistsId: string
	artistsName: string
	artists?: Partial<Artist>[]
	musics?: Partial<Music>[]
	createdAt?: Timestamp
	updatedAt?: Timestamp
}
