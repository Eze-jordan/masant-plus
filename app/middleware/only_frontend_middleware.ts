import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OnlyFrontendMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    // ✅ Ne pas filtrer en environnement de développement
    if (process.env.NODE_ENV === 'development') {
      return next()
    }

    const allowedOrigins = [
      'http://localhost:3000', // frontend dev
      'http://127.0.0.1:3333', // frontend prod
    ]

    const origin = ctx.request.header('origin') || ctx.request.header('referer') || ''
    const isAllowed = allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))

    if (!isAllowed) {
      return ctx.response.status(403).send({ error: 'Accès interdit : client non autorisé.' })
    }

    return next()
  }
}
