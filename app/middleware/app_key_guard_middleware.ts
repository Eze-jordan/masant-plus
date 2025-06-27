import { HttpContext } from '@adonisjs/core/http'

export default class AppKeyGuard {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    // Optionnel : tu peux toujours logger la clé si elle est présente
    const receivedAppKey = request.header('x-app-key')
    if (receivedAppKey) {
      console.debug('[AppKeyGuard] Clé reçue :', receivedAppKey)
    }

    // Continuer l'exécution sans restriction
    await next()
  }
}
