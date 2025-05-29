// Interface pour remplacer Firebase Timestamp
interface Timestamp {
	seconds: number
	nanoseconds: number
}

export interface User {
	id: string
	email: string
	name: string
	photoURL: string
	role: 'USER' | 'ADMIN'
	createdAt: Timestamp
	updatedAt: Timestamp
}
