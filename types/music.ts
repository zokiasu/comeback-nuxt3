import { Timestamp } from 'firebase/firestore'

export interface Music {
	id: string
	index: number
	videoId: string
	name: string
	duration: number
	hasMv: boolean
	type: 'SONG'
	date: Timestamp
	year: number
	album?: {
		albumId: string
		name: string
		type?: string
	}
	mvThumbnails?: {
		default: {
			url: string
			height: number
			width: number
		}
		high: {
			url: string
			height: number
			width: number
		}
		maxres: {
			url: string
			height: number
			width: number
		}
		medium: {
			url: string
			height: number
			width: number
		}
		standard: {
			url: string
			height: number
			width: number
		}
	}
	thumbnails?: {
		url: string
		height: number
		width: number
	}[]
	images?: string[]
	artists?: {
		artistId: string
		name: string
	}[]
	createdAt?: Timestamp
	updatedAt?: Timestamp
}
