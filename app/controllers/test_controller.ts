import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestController {
  public async test({ response, logger }: HttpContextContract) {
    logger.info('🧪 Test de l\'application')
    
    try {
      return response.json({
        status: 'success',
        message: 'Application fonctionne correctement',
        timestamp: new Date().toISOString(),
        ssr: false
      })
    } catch (error) {
      logger.error(`❌ Erreur lors du test: ${error.message}`)
      return response.status(500).json({
        status: 'error',
        message: error.message
      })
    }
  }

  public async homeTest({ inertia, logger }: HttpContextContract) {
    logger.info('🏠 Test de la page d\'accueil sans SSR')
    
    try {
      return inertia.render('home')
    } catch (error) {
      logger.error(`❌ Erreur lors du rendu de la page d'accueil: ${error.message}`)
      throw error
    }
  }
}
