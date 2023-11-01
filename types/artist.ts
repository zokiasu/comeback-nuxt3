import { type Release } from './release'

export interface Artist {
  id: string
  name: string
  idYoutubeMusic: string
  description: string
  type: string
  images: string[]
  styles: string[]
  socials: Object
  platforms: Object
  members: Artist[]
  groups: Artist[]
  releases: Release[]
}
