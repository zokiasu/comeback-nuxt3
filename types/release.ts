import type { Timestamp } from 'firebase/firestore'
import { type Music } from './music'

export interface Release {
	id: string
	idYoutubeMusic: string
	name: string
	type: string
	year: number
	needToBeVerified: boolean
	date: Timestamp
	image?: string
	artistsId: string
	artistsName: string
	platformList: {
		name: string
		link: string
	}[]
	musics?: Partial<Music>[]
	createdAt?: Timestamp
	updatedAt?: Timestamp
}
