import type { BaseEntity, UserRole } from '.'

export interface User extends BaseEntity {
	email: string
	name: string
	photo_url: string | null
	role: UserRole
}
