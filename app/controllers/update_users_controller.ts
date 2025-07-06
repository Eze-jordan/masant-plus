import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  // Fonction pour mettre à jour le statut de l'utilisateur
  public async updateStatus({ request, response, logger, params }: HttpContextContract) {
    const { id } = params // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
    const { status } = request.only(['status']) // Récupérer le nouveau statut à partir du corps de la requête

    if (!status) {
      return response.status(400).send({ error: 'Le statut est requis.' })
    }

    // 🔄 Vérifier si l'utilisateur existe
    const user = await User.find(id)  // Utiliser 'id' au lieu de 'userId'
    if (!user) {
      return response.status(404).send({ error: 'Utilisateur non trouvé.' })
    }

    // 🛑 Vérifier les statuts valides
    const validStatuses = ['PENDING', 'ACTIVE', 'INACTIVE']
    if (!validStatuses.includes(status)) {
      return response.status(400).send({ error: 'Statut invalide.' })
    }

    try {
      // Mettre à jour le statut de l'utilisateur
      user.accountStatus = status
      await user.save()

      // Ajouter un log pour la mise à jour
      logger.info(`[UserController] Le statut de l'utilisateur avec ID ${id} a été mis à jour à ${status}`)

      // Retourner une réponse confirmant la mise à jour
      return response.ok({
        message: `Le statut de l'utilisateur a été mis à jour à ${status}`,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          accountStatus: user.accountStatus,
        },
      })
    } catch (error: any) {
      logger.error(`[UserController] Erreur lors de la mise à jour du statut : ${error.message}`)
      return response.status(500).send({ error: 'Erreur serveur lors de la mise à jour du statut.' })
    }
  }
}
