export const useErrorLogger = () => {
  const logError = (error: any, context: string) => {
    // Log en console pour debugging
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: process.client ? window.location.href : 'SSR',
      userAgent: process.client ? navigator.userAgent : 'SSR'
    })
    
    // En production, on peut aussi envoyer à un service de logging
    if (process.env.NODE_ENV === 'production') {
      // Exemple avec un service de logging externe
      // sendToLoggingService(error, context)
    }
  }

  const logInfo = (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  }

  return {
    logError,
    logInfo
  }
}