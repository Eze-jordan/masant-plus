import AccountDeletionRequest from '#models/account_deletion_request'
import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AccountDeletionController {
  public async deleteAccount({ params, request, response }: HttpContextContract) {
    const userId = params.userId

    const user = await User.find(userId)

    if (!user) {
      return response.status(404).send({ message: 'Utilisateur non trouvé.' })
    }

    // 🔐 Vérifie si le demandeur peut supprimer ce compte (lui-même ou admin)

    const reason = request.input('reason')

    const deletionRequest = await AccountDeletionRequest.create({
      userId: String(user.id),
      reason,
      processed: true,
    })

    await user.delete()

    return response.ok({
      message: 'Votre compte a été supprimé avec succès.',
      deletionRequest: {
        id: deletionRequest.id,
        reason: deletionRequest.reason,
        processed: deletionRequest.processed,
      }
    })
  }
}
