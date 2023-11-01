import { type Artist } from './artist'
import { type Release } from './release'

export interface Music {
  id: string
  videoId: string
  name: string
  duration: Number
  images: string[]
  artists: Artist[]
  releases: Release[]
}
