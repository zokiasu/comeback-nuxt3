import { type Artist } from './artist'
import { type Release } from './release'

export interface Music {
  id: string
  index: Number
  videoId: string
  name: string
  duration: Number
  hasMv: boolean
  type: string
  album: {
    albumId: string,
    name: string,
  }
  mvThumbnails: any
  thumbnails: any
  images: string[]
  artists: Artist[]
  releases: Release[]
}
