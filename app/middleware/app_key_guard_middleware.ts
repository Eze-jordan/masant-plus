import { HttpContext } from '@adonisjs/core/http'

export default class AppKeyGuard {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const receivedAppKey = request.header('x-app-key')

    if (receivedAppKey !== 'boulinguiboulingui') {
      console.warn(`[AppKeyGuard] Accès refusé. Clé API invalide ou manquante.`)
      return response.unauthorized({
        message: 'Clé API invalide ou manquante.',
      })
    }

    await next()
  }
}
