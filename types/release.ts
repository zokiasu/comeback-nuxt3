import type { Timestamp } from 'firebase/firestore'
import { type Artist } from './artist'
import { type Music } from './music'

export interface Release {
  id: string
  idYoutubeMusic: string
  name: string
  type: string
  year: Number
  needToBeVerified: boolean
  platforms: string[]
  date: Timestamp
  image: string
  artistsId: string
  artistsName: string
  musics: any[]
}
