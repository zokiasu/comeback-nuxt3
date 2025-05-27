export default defineNuxtPlugin(() => {
  // Gérer les erreurs du service worker
  if (process.client && 'serviceWorker' in navigator) {
    window.addEventListener('error', (event) => {
      // Filtrer les erreurs liées au service worker
      if (event.filename && event.filename.includes('workbox')) {
        console.warn('Erreur PWA interceptée:', event.message)
        event.preventDefault()
        return false
      }
    })

    // Gérer les erreurs non capturées des promesses (service worker)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason === 'string' && event.reason.includes('workbox')) {
        console.warn('Erreur PWA Promise interceptée:', event.reason)
        event.preventDefault()
        return false
      }
    })
  }
}) 