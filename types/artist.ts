import { type Release } from './release'

export interface Artist {
  id: string
  name: string
  idYoutubeMusic: string
  description: string
  type: string
  image: string
  styles: Object[]
  socials: string[]
  platforms: string[]
  members: Artist[]
  groups: Artist[]
}
