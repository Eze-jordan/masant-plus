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


  public async getAppointmentDates({ params, response }: HttpContextContract) {
    const patientId = params.id

    if (!patientId) {
      return response.badRequest({ message: 'patientId manquant dans les paramètres' })
    }

    // Récupérer tous les RDV du patient, sans filtrer par statut
    const appointments = await Appointment.query()
      .where('idUser', patientId)
      .select('dateRdv')  // Sélectionne uniquement la colonne 'date'

    if (appointments.length === 0) {
      return response.notFound({ message: 'Aucun rendez-vous trouvé pour ce patient.' })
    }

    // Extraire toutes les dates des RDV
    const appointmentDates = appointments.map(app => app.dateRdv)

    return response.ok({ appointmentDates })
  }
}
