import { HttpContext } from '@adonisjs/core/http'

export default class AppKeyGuard {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    // Si la méthode est GET, on laisse passer sans vérification
    if (request.method() === 'GET') {
      await next()
      return
    }

    // Sinon, on vérifie la clé API
    const receivedAppKey = request.header('x-app-key')

    if (receivedAppKey !== 'boulinguiboulingui') {
      console.warn(`[AppKeyGuard] Accès refusé. Clé API invalide ou manquante.`)
      return response.unauthorized({
        message: 'Clé API invalide ou manquante.',
      })
    }

    // Appeler la méthode handle() de AssociateSpecialites
    console.log(`[AppKeyGuard] Clé API valide. Accès autorisé.`)
    await next()
  }
}
