import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnlyFrontendMiddleware {
  public async handle({ request, response }: HttpContext, next: NextFn) {
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
