import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
export default class OnlyFrontendMiddleware {
  public async handle(_ctx: HttpContext, next: NextFn) {
    // Pas de vérification du User-Agent, on laisse passer toutes les requêtes
    console.log('[OnlyFrontendMiddleware] ➤ Requête reçue, autorisée sans restriction.')

    return next()
  }
}
