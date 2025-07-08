import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import vine from '@vinejs/vine'

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
   * PUT /users/:id
   * Met à jour les informations d'un utilisateur
   */
  public async update({ params, request, response }: HttpContextContract) {
    const updateUserSchema = vine.object({
      firstName: vine.string().trim().maxLength(50).optional(),
      lastName: vine.string().trim().maxLength(50).optional(),
      email: vine
        .string()
        .trim()
        .email()
        .maxLength(255)
        .unique(async (db, value) => {
          const user = await db.from('users')
            .where('email', value)
            .whereNot('id', params.id)
            .first()
          return !user
        })
        .optional(),
      phone: vine.string().trim().mobile().maxLength(20).optional(),
      address: vine.string().trim().maxLength(255).optional(),
      specialisation: vine.string().trim().maxLength(100).optional(),
      profileImage: vine.string().trim().maxLength(255).optional(),
      about: vine.string().trim().optional(),
      yearsExperience: vine.string().trim().optional(),
      availability: vine.string().trim().optional(),
      specialty: vine.string().trim().optional(),
    })

    try {
      const payload = await vine.validate({
        schema: updateUserSchema,
        data: request.all(),
      })

      const user = await User.findOrFail(params.id)
      user.merge(payload)
      await user.save()

      return response.ok({
        message: 'Profil mis à jour avec succès',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          specialisation: user.specialisation,
          address: user.address,
          profileImage: user.profileImage,
          about: user.about,
          yearsExperience: user.yearsExperience,
          availability: user.availability,
          specialty: user.specialty,
        },
      })
    } catch (error: any) {
      console.error(error)
      return response.status(error.status || 500).json({
        message: "Erreur lors de la mise à jour du profil",
        error: error.messages || error.message,
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