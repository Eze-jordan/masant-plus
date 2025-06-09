import { HttpContext } from '@adonisjs/core/http'

export default class AppKeyGuard {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    const receivedAppKey = request.header('x-app-key')

    if (receivedAppKey) {
      console.debug('[AppKeyGuard] Clé reçue :', receivedAppKey)
    } else {
      console.warn('[AppKeyGuard] Aucune clé reçue dans le header x-app-key')
    }

    await next()
  }
}
