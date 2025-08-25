import Appointment from '#models/appointment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV } from '../enum/enums.js'

export default class AppointmentDiscussionController {
  /**
   * Récupère uniquement les docteurs liés aux RDV confirmés du patient (sans les RDV eux-mêmes)
   */
  public async getDoctorsFromConfirmedAppointments({ params, response }: HttpContextContract) {
    const patientId = params.id

    if (!patientId) {
      return response.badRequest({ message: 'patientId manquant dans les paramètres' })
    }

    // Récupérer RDV confirmés avec préchargement des docteurs
    const confirmedAppointments = await Appointment.query()
      .where('idUser', patientId)
      .where('etatRdv', EtatRDV.CONFIRME)
      .preload('doctor')

    // Extraire uniquement les docteurs
    const doctors = confirmedAppointments
      .map(app => app.doctor)
      .filter(doctor => doctor != null) // filtrer si jamais doctor absent

    // Supprimer les doublons (par id)
    const uniqueDoctors = doctors.filter(
      (doctor, index, self) => index === self.findIndex(d => d.id === doctor.id)
    )

    return response.ok({ doctors: uniqueDoctors })
  }


 public async getAppointmentHistory({ params, response }: HttpContextContract) {
    const patientId = params.id

    // Vérification si le patientId est fourni
    if (!patientId) {
      return response.badRequest({ message: 'patientId manquant dans les paramètres' })
    }

    // Récupérer les rendez-vous pour le patient
    const appointments = await Appointment.query()
      .where('idUser', patientId)  // Assurez-vous que 'idUser' est correct
      .select('id', 'dateRdv', 'description')  // Sélectionner les champs nécessaires

    // Vérifier s'il y a des rendez-vous pour ce patient
    if (appointments.length === 0) {
      return response.notFound({ message: 'Aucun rendez-vous trouvé pour ce patient.' })
    }

    // Mapper les rendez-vous pour correspondre à la structure `History`
    const history: History[] = appointments.map(app => ({
      id: app.id,  // ID du rendez-vous
      date: app.dateRdv,  // Date du rendez-vous
      description: app.description || 'Pas de description disponible',  // Description du rendez-vous (s'il y en a une)
    }))

    // Renvoi de l'historique des rendez-vous
    return response.ok({ history })
  }
}
