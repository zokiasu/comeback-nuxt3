import { Timestamp } from 'firebase/firestore'

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