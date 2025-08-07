import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async home({ inertia, logger }: HttpContextContract) {
    logger.info('🏠 Page d\'accueil demandée - SSR activé')
    
    try {
      return inertia.render('home')
    } catch (error) {
      logger.error(`❌ Erreur lors du rendu de la page d'accueil: ${error.message}`)
      throw error
    }
  }
}
