import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Docteur } from '#models/user'

export default class SpecialiteController {
  public async getAllSpecialties({ response }: HttpContextContract) {
    try {
      // Récupérer toutes les spécialisations non nulles des docteurs
      const doctors = await Docteur.query()
        .where('type', 'doctor')
        .whereNotNull('specialisation') // Filtrer ceux qui ont une spécialisation

      // Extraire la liste des spécialisations
      const specialisations = doctors
        .map((doc) => doc.specialisation)
        .filter((spec): spec is string => !!spec) // Retire les null/undefined

      // Supprimer les doublons
      const uniqueSpecialisations = [...new Set(specialisations)]

      return response.status(200).send({
        message: 'Liste des spécialisations récupérée avec succès.',
        specialities: uniqueSpecialisations,
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
