import app from '@adonisjs/core/services/app'
import { errors } from '@adonisjs/core'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  @inject()
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_ROUTE_NOT_FOUND) {
      if (ctx.request.accepts(['json'])) {
        return ctx.inertia.render('errors/not_found', { status: 404 })

      }
      
      return ctx.inertia.render('errors/not_found', { status: 404 })
    }

    return super.handle(error, ctx)
  }
}