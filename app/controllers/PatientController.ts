import User from '#models/user'
import Paiement from '#models/paiement'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientController {
  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    try {
      // Récupérer le patient
      const patient = await User.query()
        .where('id', id)
        .firstOrFail()

      // Récupérer les paiements effectués par ce patient
      const paiements = await Paiement.query()
        .where('idUser', id)
        .orderBy('datePaiement', 'desc') // Trier par date du paiement, du plus récent au plus ancien
        .first() // Récupérer seulement le premier paiement si on veut juste un paiement récent, sinon `.fetch()` pour tous

      if (!paiements) {
        return response.status(200).json({ message: 'No payments found for this patient.' })
      }

      // Si un paiement a été effectué, on renvoie les détails du patient + du paiement
      return response.ok({
        patient: {
          id: patient.id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          email: patient.email,
          phone: patient.phone,
          profileImage: patient.profileImage,  // Inclure l'avatar
        },
        paiement: {
          montant: paiements.montant,
          date: paiements.datePaiement.toFormat('yyyy-LL-dd'),  // Format de date Luxon
          statut: paiements.statut,  // Statut du paiement
          modePaiement: paiements.modeId,  // Mode de paiement (ajuste selon la relation)
        }
      })
    } catch (error) {
      console.log('Patient not found with id:', id)
      return response.status(404).json({ message: 'Patient not found' })
    }
  }
}
