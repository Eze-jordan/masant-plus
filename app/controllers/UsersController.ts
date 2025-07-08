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
    } catch (error: any) {
      console.error(error)
      return response.status(404).json({
        message: 'Utilisateur non trouvé',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /users/:id
   * Supprime un utilisateur
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.ok({
        message: 'Utilisateur supprimé avec succès',
      })
    } catch (error: any) {
      console.error(error)
      return response.status(500).json({
        message: "Erreur lors de la suppression de l'utilisateur",
        error: error.message,
      })
    }
  }
}