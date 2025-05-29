// Interface pour remplacer Firebase Timestamp
interface Timestamp {
	seconds: number
	nanoseconds: number
}

declare global {
	interface Window {
		algolia: any
	}
}

// Déclaration des types pour les résultats d'Algolia
export interface AlgoliaHit {
	objectID: string
	name?: string
	image?: string
	description?: string
	type?: string
	idYoutubeMusic?: string
	styles?: any[]
	socialList?: any[]
	platformList?: any[]
	createdAt?: Timestamp
	updatedAt?: Timestamp
	// Propriétés spécifiques aux releases
	artistsName?: string
	artistsId?: string
	date?: Timestamp
	year?: number
	needToBeVerified?: boolean
	// Propriétés Algolia
	_highlightResult?: Record<string, any>
	_snippetResult?: Record<string, any>
	_rankingInfo?: Record<string, any>
	_distinctSeqID?: number
}

export interface AlgoliaArtist {
	id: string
	name: string
	image: string
	description: string
	verified: boolean
	createdAt: Timestamp
	updatedAt: Timestamp
	styles: string[]
	generalTags: string[]
}

export interface AlgoliaMusic {
	id: string
	title: string
	youtube_id: string
	youtube_link: string
	description: string
	artist: string
	imageURL: string
	createdAt: Timestamp
	updatedAt: Timestamp
}
