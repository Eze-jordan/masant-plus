import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PourcentageComptesController {
  // Méthode pour calculer le pourcentage de complétion
  private calculateProfileCompletion(user: User): number {
    const fields = [
      user.email,
      user.phone,
      user.first_name,
      user.last_name,
      user.weight,
      user.dateNaissance,
      user.about,
      user.genre,
      user.groupeSanguin,
      user.anneeExperience,
      user.address,
      user.accountStatus,
      user.profileImage,
    ]

    const filledFieldsCount = fields.filter(field => {
      if (field === undefined || field === null) return false
      if (typeof field === 'string' && field.trim() === '') return false
      return true
    }).length

    const totalFields = fields.length
    const percentage = (filledFieldsCount / totalFields) * 100
    return Math.round(percentage)
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({ message: 'Utilisateur non trouvé' })
      }

      const completionPercentage = this.calculateProfileCompletion(user)

      return response.json({
        id: user.id,
        profileCompletionPercentage: completionPercentage,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: "Erreur lors de la récupération du pourcentage de complétion",
        error: error.message,
      })
    }
  }
}
