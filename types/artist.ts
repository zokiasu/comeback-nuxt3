import { type Release } from './release'

export interface Artist {
  id: string
  name: string
  idYoutubeMusic: string
  description: string
  verified: boolean
  activeCareer: boolean
  type: string
  image: string
  styles: Object[]
  socialList: {
    name: string
    link: string
  }[]
  platformList: {
    name: string
    link: string
  }[]
  members: Partial<Artist>[]
  groups: Partial<Artist>[]
  releases: Partial<Release>[]
}
