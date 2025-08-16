import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appointment from '#models/appointment'
import { DateTime } from 'luxon'

export default class AppointmentsController {
  /**
   * Récupère tous les rendez-vous d'un utilisateur avec leur statut dynamique
   */
  public async list({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId

      const appointments = await Appointment
        .query()
        .where('id_user', userId)
        .preload('patient', (query) => {
          query.select(['id', 'first_name'])
        })
        .orderBy('date_rdv', 'desc')

      const now = DateTime.local()

      const formatted = appointments.map((appointment) => {
        const start = DateTime.fromISO(`${appointment.dateRdv.toISODate()}T${appointment.heureDebut}`)
        const end = DateTime.fromISO(`${appointment.dateRdv.toISODate()}T${appointment.heureFin}`)

        let currentStatus: string

        switch (appointment.etatRdv) {
          case 'ANNULE':
            currentStatus = 'ANNULE'
            break
          case 'CONFIRME':
          default:
            if (now < start) {
              currentStatus = 'à venir'
            } else if (now >= start && now <= end) {
              currentStatus = 'en cours'
            } else {
              currentStatus = 'terminé'
            }
        }

        return {
          id: appointment.id,
          patientName: appointment.patient?.first_name ?? 'Inconnu',
          date: appointment.dateRdv.toISODate(),
          heureDebut: appointment.heureDebut,
          heureFin: appointment.heureFin,
          type: appointment.typeRdv,
          etatClinique: appointment.etatRdv,
          currentStatus,
        }
      })

      return response.ok(formatted)
    } catch (error) {
      console.error('Erreur récupération appointments:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  /**
   * Récupère les détails d’un seul rendez-vous par son ID
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const appointmentId = params.id

      const appointment = await Appointment
        .query()
        .where('id', appointmentId)
        .preload('patient', (query) => query.select(['id', 'first_name']))
        .preload('doctor', (query) => query.select(['id', 'first_name']))
        .firstOrFail()

      const start = DateTime.fromISO(`${appointment.dateRdv.toISODate()}T${appointment.heureDebut}`)
      const end = DateTime.fromISO(`${appointment.dateRdv.toISODate()}T${appointment.heureFin}`)
      const now = DateTime.local()

      let currentStatus: string

      switch (appointment.etatRdv) {
        case 'ANNULE':
          currentStatus = 'annulé'
          break
        case 'CONFIRME':
        default:
          if (now < start) {
            currentStatus = 'à venir'
          } else if (now >= start && now <= end) {
            currentStatus = 'en cours'
          } else {
            currentStatus = 'terminé'
          }
      }

      const result = {
        id: appointment.id,
        patientName: appointment.patient?.first_name ?? 'Inconnu',
        doctorName: appointment.doctor?.first_name ?? 'Inconnu',
        date: appointment.dateRdv.toISODate(),
        heureDebut: appointment.heureDebut,
        heureFin: appointment.heureFin,
        type: appointment.typeRdv,
        etatClinique: appointment.etatRdv,
        currentStatus,
      }

      return response.ok(result)
    } catch (error) {
      console.error('Erreur récupération appointment:', error)
      return response.status(404).json({ message: 'Rendez-vous introuvable' })
    }
  }
}
