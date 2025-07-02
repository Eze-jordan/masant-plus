import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'

export default class UsersController {
  /**
   * GET /users/:id
   * Récupère les infos principales du profil pour le front (profil utilisateur).
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .select([
          'id',
          'firstName',
          'lastName',
          'email',
          'phone',
          'specialisation',
          'address',
          'profileImage',
        ])
        .firstOrFail()

      return response.ok({
        message: 'Utilisateur trouvé avec succès',
        user,
      })
    } catch (error) {
      console.error(error)
      return response.status(404).json({
        message: 'Utilisateur non trouvé',
        error: error.message,
      })
    }
  }
}
