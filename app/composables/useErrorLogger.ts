export const useErrorLogger = () => {
	const isDevelopment = process.env.NODE_ENV === 'development'

	const logError = (error: any, context: string) => {
		if (isDevelopment) {
			// Log détaillé en développement
			console.error(`[${context}] Error:`, {
				message: error.message,
				stack: error.stack,
				timestamp: new Date().toISOString(),
				url: process.client ? window.location.href : 'SSR',
				userAgent: process.client ? navigator.userAgent : 'SSR',
			})
		} else {
			// Log minimal en production
			console.error(`[${context}] Error:`, error.message)

			// En production, on peut envoyer à un service de logging externe
			// sendToLoggingService(error, context)
		}
	}

	const logInfo = (message: string, data?: any) => {
		if (isDevelopment) {
			console.log(`[INFO] ${message}`, data)
		}
		// En production, on peut logger seulement les infos importantes
	}

	return {
		logError,
		logInfo,
	}
}
