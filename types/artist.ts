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
  socialObjects: {
    name: string
    link: string
  }[]
  platforms: string[]
  platformObjects: {
    name: string
    link: string
  }[]
  members: Partial<Artist>[]
  groups: Partial<Artist>[]
}
