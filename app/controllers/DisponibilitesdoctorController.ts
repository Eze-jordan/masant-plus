// app/Controllers/Http/DisponibilitesController.ts
import Disponibilite from '#models/disponibilite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DisponibilitesController {
  public async index({ response }: HttpContextContract) {
    try {
      // Récupérer toutes les disponibilités avec les informations du médecin (User)
      const disponibilites = await Disponibilite.query()
        .preload('doctor') // Charge les informations du médecin associé (relation 'doctor' dans le modèle Disponibilite)
        .orderBy('date_debut', 'asc') // Trier par la date de début de disponibilité

      // Vérifier si des disponibilités ont été trouvées
      if (disponibilites.length === 0) {
        return response.status(404).json({ message: 'Aucune disponibilité trouvée' })
      }

      // Répondre avec les disponibilités
      return response.json(disponibilites)
    } catch (error) {
      return response.status(500).json({ message: 'Erreur serveur', error: error.message })
    }
  }
}
