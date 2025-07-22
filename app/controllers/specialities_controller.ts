import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Docteur } from '#models/user'

export default class SpecialiteController {
  public async getAllSpecialties({ response }: HttpContextContract) {
    try {
      // Récupérer tous les docteurs avec une spécialisation définie
      const doctors = await Docteur.query()
        .where('type', 'doctor')
        .whereNotNull('specialisation')

      // Regrouper les docteurs par spécialisation avec un comptage
      const specialityCounts: Record<string, number> = {}

      doctors.forEach((doctor) => {
        const spec = doctor.specialisation
        if (spec) {
          specialityCounts[spec] = (specialityCounts[spec] || 0) + 1
        }
      })

      // Transformer l'objet en tableau [{ specialisation, total }]
      const specialities = Object.entries(specialityCounts).map(([specialisation, total]) => ({
        specialisation,
        total,
      }))

      return response.status(200).send({
        message: 'Liste des spécialisations récupérée avec succès.',
        specialities,
      })
    } catch (error) {
      console.error('[SpecialiteController] Erreur lors de la récupération des spécialisations:', error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération des spécialisations.',
        error: error.message,
      })
    }
  }
}
