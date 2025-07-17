export default defineNuxtPlugin(() => {
  if (process.server) {
    const { logError } = useErrorLogger()

    // Capturer les erreurs Vue côté serveur
    const app = useNuxtApp()
    app.hook('vue:error', (error, context) => {
      logError(error, `ssr-vue-error-${context}`)
    })

    // Capturer les erreurs de rendu
    app.hook('render:error', (error, context) => {
      logError(error, `ssr-render-error`)
    })
  }
})