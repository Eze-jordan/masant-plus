import Ressource from '#models/Ressource'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResourcesController {
  // Récupérer toutes les ressources d'un utilisateur via son id
  public async index({ params, response }: HttpContextContract) {
    try {
      const userId = params.id

      if (!userId) {
        return response.badRequest({ message: "L'identifiant utilisateur est requis." })
      }

      // Récupérer toutes les ressources liées à cet utilisateur
      const ressources = await Ressource.query()
        .where('user_id', userId)
        .orderBy('created_at', 'desc')

      return response.ok({
        message: `Ressources de l'utilisateur ${userId} récupérées avec succès.`,
        data: ressources,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources :', error)
      return response.status(500).send({
        message: 'Erreur serveur lors de la récupération des ressources.',
        error: error.message,
      })
    }
  }
}
