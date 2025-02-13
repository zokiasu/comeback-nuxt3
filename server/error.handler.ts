import { H3Error } from 'h3'

export default defineEventHandler((error: H3Error) => {
	// Log l'erreur en interne
	console.error('Server error:', error)

	// Retourner une réponse d'erreur appropriée
	const isProd = process.env.NODE_ENV === 'production'

	return {
		statusCode: error.statusCode || 500,
		statusMessage: isProd ? 'Internal Server Error' : error.message,
		data: isProd
			? null
			: {
					stack: error.stack,
					detail: error.cause,
				},
	}
})
