import { type Artist } from './artist'
import { type Release } from './release'
import { Timestamp } from 'firebase/firestore'

export interface Music {
  id: string
  index: number
  videoId: string
  name: string
  duration: number
  hasMv: boolean
  type: 'SONG' | 'MV' | 'LIVE' | 'COVER'
  date?: Timestamp
  year?: number
  album?: {
    albumId: string,
    name: string,
    type?: string
  }
  mvThumbnails?: any[]
  thumbnails?: any[]
  images?: string[]
  artists?: {
    artistId: string,
    name: string
  }[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
  releases?: Release[]
}
