import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime } from 'luxon'

export default class AppointmentController {
  /**
   * Récupérer les rendez-vous d'un médecin
   */
  public async getAppointmentsForDoctor({ request, response }: HttpContextContract) {
    try {
      const idDoctor = request.input('idDoctor')

      if (!idDoctor) {
        return response.badRequest({ message: 'idDoctor est requis.' })
      }

      const filterType = request.input('typeRdv') as keyof typeof TypeRDV | undefined
      const filterEtat = request.input('etatRdv') as keyof typeof EtatRDV | undefined

      // Filtres optionnels

      // Validation des filtres
      if (filterType && !Object.keys(TypeRDV).includes(filterType)) {
        return response.badRequest({ message: `typeRdv invalide : ${filterType}` })
      }

      if (filterEtat && !Object.keys(EtatRDV).includes(filterEtat)) {
        return response.badRequest({ message: `etatRdv invalide : ${filterEtat}` })
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
      console.error('[getAppointmentsForDoctor] Erreur :', error)
      return response.internalServerError({ message: 'Erreur serveur lors de la récupération des rendez-vous.' })
    }
  }

  /**
   * Créer un nouveau rendez-vous
   */
  public async create({ request, response }: HttpContextContract) {
    try {
      const payload = request.only([
        'idDoctor',
        'idPatient',
        'date',
        'typeRdv',
        'etatRdv',
        'description',
      ])

      // Vérification des champs obligatoires
      if (!payload.idDoctor || !payload.idPatient || !payload.date || !payload.typeRdv || !payload.etatRdv) {
        return response.badRequest({ message: 'Champs requis manquants.' })
      }

      // Validation des valeurs d'enum
      if (!Object.keys(TypeRDV).includes(payload.typeRdv)) {
        return response.badRequest({ message: `typeRdv invalide : ${payload.typeRdv}` })
      }

      if (!Object.keys(EtatRDV).includes(payload.etatRdv)) {
        return response.badRequest({ message: `etatRdv invalide : ${payload.etatRdv}` })
      }

      const dateRdv = DateTime.fromISO(payload.date)
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' })
      }

      const appointment = await Appointment.create({
        idDoctor: payload.idDoctor,
        idUser: payload.idPatient,
        dateRdv: dateRdv,
        typeRdv: payload.typeRdv,
        etatRdv: payload.etatRdv,
        heureDebut: '09:00', // à personnaliser
        heureFin: '09:30',   // idem
      
      })

      return response.created(appointment)
    } catch (error) {
      console.error('[AppointmentController.create] Erreur :', error)
      return response.internalServerError({ message: 'Erreur serveur lors de la création du rendez-vous.' })
    }
  }
}
