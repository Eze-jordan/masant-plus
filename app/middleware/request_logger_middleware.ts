// app/Middleware/RequestLogger.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LogService from '#services/LogService'
export default class RequestLogger {
  public async handle({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    const userId = auth.user ? (auth.user.id ?? auth.user.uid ?? null) : null
    try {
      const body = (() => {
        try { return request.raw() || request.body() } catch { return {} }
      })()

      LogService.info(`${userId ? `USER:${userId}` : 'GUEST'} → ${request.method()} ${request.url()} | body: ${JSON.stringify(body)}`)
    } catch (err) {
      // si le logger plante, ne bloque pas la requête
      console.error('RequestLogger error: ', err)
    }

    await next()
  }
}
