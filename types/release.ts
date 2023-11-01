import { type Artist } from './artist'
import { type Music } from './music'

export interface Release {
  id: string
  idYoutubeMusic: string
  name: string
  type: string
  year: Number
  verified: boolean
  platforms: Object
  dateRelease: string
  images: string[]
  artists: Artist[]
  music: Music[]
}
