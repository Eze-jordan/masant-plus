import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnlyFrontendMiddleware {
  public async handle({ request, response }: HttpContext, next: NextFn) {
    // Si c'est une requête GET, on laisse passer sans vérifier la clé
    if (request.method() === 'GET') {
      console.log('[OnlyFrontendMiddleware] ➤ GET, requête autorisée sans clé.')
      return next()
    }

    const appKey = request.header('x-app-key')

    if (appKey === 'boulinguiboulingui') {
      console.log('[OnlyFrontendMiddleware] ➤ Clé valide, requête autorisée.')
      return next()
    }

    console.warn('[OnlyFrontendMiddleware] ❌ Requête bloquée. Clé manquante ou invalide.')
    return response.unauthorized({
      message: 'Accès refusé. Requête non autorisée.',
    })
  }
}
