import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Discussion from '#models/discussion'
import Ressource from '#models/Ressource'

export default class PatientsController {
  /**
   * Récupère la liste des doctors qui ont échangé avec un patient donné (patientId dans params.id)
   */
  public async getDoctorsByPatient({ params, response }: HttpContextContract) {
    const patientId = params.id

    if (!patientId) {
      return response.badRequest({ message: 'Patient ID manquant' })
    }

    try {
      // Charger toutes les discussions où le patient est patientId, avec les doctors préchargés
      const discussions = await Discussion.query()
        .where('idPatient', patientId)
        .preload('doctor')

      // Extraire les doctors uniques (éviter doublons)
      const doctorsMap = new Map<string, typeof discussions[0]['doctor']>()
      discussions.forEach(discussion => {
        if (discussion.doctor && !doctorsMap.has(discussion.doctor.id)) {
          doctorsMap.set(discussion.doctor.id, discussion.doctor)
        }
      })

      const doctors = Array.from(doctorsMap.values())

      return response.ok(doctors)
    } catch (error) {
      return response.status(500).json({ message: 'Erreur lors de la récupération des doctors' })
    }
  }

  /**
   * Récupère toutes les ressources d’un patient donné (userId dans params.userId)
   */
  public async getRessourcesByPatient({ params, response }: HttpContextContract) {
    let userId = params.id
  
    if (!userId) {
      return response.badRequest({ message: 'userId manquant' })
    }
  
    // Nettoyage : retirer préfixe "id" si présent
    if (userId.startsWith('id')) {
      userId = userId.substring(2)
    }
  
    try {
      const ressources = await Ressource.query().where('userId', userId)
      return response.ok(ressources)
    } catch (error) {
      console.error('Erreur getRessourcesByPatient:', error)
      return response.status(500).json({ message: 'Erreur lors de la récupération des ressources' })
    }
  }
  
}
