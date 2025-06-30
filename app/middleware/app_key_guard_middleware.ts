import { HttpContext } from '@adonisjs/core/http'

export default class AppKeyGuard {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const method = request.method()
    const receivedAppKey = request.header('x-app-key')

    // Autoriser toutes les requêtes GET sans restriction
    if (method === 'GET') {
      return await next()
    }

    // Pour les autres méthodes, vérifier la clé
    if (receivedAppKey !== 'boulinguiboulingui') {
      console.warn(`[AppKeyGuard] Accès refusé. Mauvaise clé ou clé manquante.`)
      return response.unauthorized({
        message: 'Clé API invalide ou manquante.',
      })
    }

    // Continuer si la clé est correcte
    await next()
  }
}
