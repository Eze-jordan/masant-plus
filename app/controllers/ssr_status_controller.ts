import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SsrStatusController {
  public async status({ response, logger }: HttpContextContract) {
    logger.info('🔍 Vérification du statut SSR')

    try {
      // Vérifier si les fichiers SSR existent
      const fs = await import('fs/promises')
      const path = await import('path')

      const ssrFiles = [
        'build/client/inertia/app/ssr.js',
        'build/client/inertia/app/app.js',
        'public/assets/.vite/manifest.json'
      ]

      const status = {
        ssrEnabled: true,
        files: {} as Record<string, boolean>,
        timestamp: new Date().toISOString()
      }

      for (const file of ssrFiles) {
        try {
          await fs.access(file)
          status.files[file] = true
        } catch {
          status.files[file] = false
        }
      }

      // Ici, vous pouvez ajouter la logique de rendu SSR.
      if (status.ssrEnabled && status.files['build/client/inertia/app/ssr.js']) {
        // Ici, générez le contenu SSR, par exemple en exécutant le code de génération de page côté serveur
        // Vous pouvez utiliser des librairies comme ReactDOMServer, VueSSR ou autre pour effectuer cette génération
        const ssrPage = '<html><body><h1>Page SSR générée</h1></body></html>'

        // Retourner le HTML généré
        return response.send(ssrPage)
      } else {
        return response.json(status)
      }
      
    } catch (error) {
      logger.error(`❌ Erreur lors de la vérification SSR: ${error.message}`)
      return response.status(500).json({
        error: 'Erreur lors de la vérification SSR',
        message: error.message
      })
    }
  }
}
