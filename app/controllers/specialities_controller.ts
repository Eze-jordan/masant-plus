import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Docteur } from '#models/user'
import Specialite from '#models/specialite'

export default class SpecialiteController {
  public async getAllSpecialties({ response }: HttpContextContract) {
    try {
      // Récupérer tous les docteurs avec une spécialisation définie
      const doctors = await Docteur.query()
        .where('type', 'doctor')
        .whereNotNull('specialisation')

      // Regrouper les docteurs par spécialisation avec un comptage
      const specialityCounts: Record<string, number> = {}

      // Compter le nombre de docteurs par spécialisation, en tenant compte des variations de casse et espaces
      doctors.forEach((doctor) => {
        const spec = doctor.specialisation?.trim().toLowerCase() // On enlève les espaces et ignore la casse
        if (spec) {
          specialityCounts[spec] = (specialityCounts[spec] || 0) + 1
        }
      })

      // Récupérer toutes les spécialités avec tous leurs champs
      const allSpecialities = await Specialite.query().select('id', 'label', 'description', 'icon', 'color')

      // Construire le tableau final en incluant toutes les spécialités, même sans docteurs
      const specialities = allSpecialities.map((specialite) => {
        // Comparer le label de la spécialité après avoir nettoyé les espaces et normalisé la casse
        const labelNormalized = specialite.label?.trim().toLowerCase()

        return {
          id: specialite.id,
          label: specialite.label,
          description: specialite.description,
          icon: specialite.icon,
          color: specialite.color,
          doctorCount: specialityCounts[labelNormalized] || 0, // Nombre de docteurs pour cette spécialité
        }
      })

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
