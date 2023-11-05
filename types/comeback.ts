import type { Artist } from './artist'
import type { User } from './user'

export interface Comeback {
  id: string
  message: string
  verified: boolean
  date: Date
  artist: Partial<Artist>
  user: Partial<User>
}
