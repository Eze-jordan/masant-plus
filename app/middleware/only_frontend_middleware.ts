import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnlyFrontendMiddleware {
  public async handle({ request, response }: HttpContext, next: NextFn) {
    const method = request.method()
    const appKey = request.header('x-app-key')

    // Autoriser toutes les requêtes GET
    if (method === 'GET') {
      console.log('[OnlyFrontendMiddleware] ➤ Requête GET autorisée.')
      return next()
    }

    // Autoriser si x-app-key === 'boulinguiboulingui'
    if (appKey === 'boulinguiboulingui') {
      console.log('[OnlyFrontendMiddleware] ➤ Clé valide, requête autorisée.')
      return next()
    }

    // Sinon, bloquer la requête
    console.warn('[OnlyFrontendMiddleware] ❌ Requête bloquée. Clé manquante ou invalide.')
    return response.unauthorized({
      message: 'Accès refusé. Requête non autorisée.',
    })
  }
}
