import type { Timestamp } from 'firebase/firestore'

export interface User {
	id: string
	name: string
	country?: string
	email: string
	photoURL: string
	role: 'ADMIN' | 'USER' | 'MODERATOR'
	createdAt: Timestamp
	updatedAt: Timestamp
}
