import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime } from 'luxon'

export default class AppointmentController {
  public async getAppointmentsForDoctor({ request, response }: HttpContextContract) {
    try {
      const idDoctor = request.input('idDoctor')

      if (!idDoctor) {
        return response.badRequest({ message: 'idDoctor est requis' })
      }

      // Filtres optionnels
      const filterType = request.input('typeRdv') as keyof typeof TypeRDV | undefined
      const filterEtat = request.input('etatRdv') as keyof typeof EtatRDV | undefined

      // Validation des filtres
      if (filterType && !Object.keys(TypeRDV).includes(filterType)) {
        return response.badRequest({ message: `typeRdv invalide: ${filterType}` })
      }

      if (filterEtat && !Object.keys(EtatRDV).includes(filterEtat)) {
        return response.badRequest({ message: `etatRdv invalide: ${filterEtat}` })
      }

      // Construction de la requête
      const query = Appointment.query().where('idDoctor', idDoctor)

      if (filterType) {
        query.andWhere('typeRdv', filterType)
      }

      if (filterEtat) {
        query.andWhere('etatRdv', filterEtat)
      }

      // Chargement des relations
      const appointments = await query
        .preload('patient') 
        .preload('paiements')
        .preload('prescription')
        .preload('review')

      // Transformation des données
      const result = appointments.map((appointment) => {
        const dateIso = appointment.dateRdv.toISODate() // ex: "2025-07-04"
        const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`, { zone: 'local' })
        const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`, { zone: 'local' })

        console.log('dateRdv:', appointment.dateRdv.toISO())
        console.log('heureDebut:', appointment.heureDebut)
        console.log('dateDebut:', dateDebut.toISO(), 'valid:', dateDebut.isValid)

        return {
          id: appointment.id,
          typeRdv: appointment.typeRdv,
          etatRdv: appointment.etatRdv,
          
          nomPatient: appointment.patient?.username ?? null,
          prenomPatient: appointment.patient?.firstName ?? null,
          paiements: appointment.paiements,
          prescription: appointment.prescription,
          review: appointment.review,
          dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
          dateFin: dateFin.isValid ? dateFin.toISO() : null,
        }
      })

      return response.ok(result)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Erreur serveur' })
    }
  }
}
