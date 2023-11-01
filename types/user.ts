import type { Comeback } from "./comeback"

export interface User {
  id: string
  idFirebase: string
  username: string
  country: string
  picture: string
  role: string[]
  comebacks: Comeback[]
}
