import LogService from '#services/log_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ActionLoggerMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const { request, response } = ctx

    await next()

    // Routes à ignorer
    const ignore = ['/favicon.ico', '/assets', '/public', '/docs', '/swagger']
    if (ignore.some((p) => request.url().startsWith(p))) {
      return
    }

    const action = `${request.method()} ${request.url()}`
    const statusCode = response.getStatus()

    await LogService.log(request, action, statusCode)
  }
}
