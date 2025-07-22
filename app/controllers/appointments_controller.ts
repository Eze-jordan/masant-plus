import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime, Interval } from 'luxon'


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
          
          nomPatient: appointment.patient?.first_name ?? null,
          prenomPatient: appointment.patient?.last_name ?? null,
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
        'heureDebut',
        'heureFin',
        'description'
      ])

      const dateRdv = DateTime.fromISO(payload.date)
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' })
      }

      // Convertir heures en DateTime pour la même date
      let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`)
      let heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`)

      if (!heureDebut.isValid || !heureFin.isValid || heureFin <= heureDebut) {
        return response.badRequest({ message: 'Heures invalides ou fin avant début.' })
      }

      const slotDurationMinutes = heureFin.diff(heureDebut, 'minutes').minutes

      // Récupérer les rdv du docteur pour la date demandée
      const existingAppointments = await Appointment.query()
        .where('idDoctor', payload.idDoctor)
        .andWhere('dateRdv', dateRdv.toISODate())

      // Fonction pour vérifier chevauchement
      function isOverlapping(intervalA: Interval, intervalB: Interval) {
        return intervalA.overlaps(intervalB)
      }

      // Construire interval demandé
      let requestedInterval = Interval.fromDateTimes(heureDebut, heureFin)

      // Vérifier chevauchement initial
      let hasOverlap = existingAppointments.some(app => {
        const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`)
        const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`)
        const appInterval = Interval.fromDateTimes(appStart, appEnd)
        return isOverlapping(requestedInterval, appInterval)
      })

      // Si conflit, essayer de décaler jusqu'à 10 fois
      let attempts = 0
      while (hasOverlap && attempts < 10) {
        heureDebut = heureDebut.plus({ minutes: slotDurationMinutes })
        heureFin = heureFin.plus({ minutes: slotDurationMinutes })
        requestedInterval = Interval.fromDateTimes(heureDebut, heureFin)

        hasOverlap = existingAppointments.some(app => {
          const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`)
          const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`)
          const appInterval = Interval.fromDateTimes(appStart, appEnd)
          return isOverlapping(requestedInterval, appInterval)
        })

        attempts++
      }

      if (hasOverlap) {
        return response.badRequest({ message: 'Impossible de trouver un créneau libre.' })
      }

      // Créer le rendez-vous avec le créneau trouvé
      const appointment = await Appointment.create({
        idDoctor: payload.idDoctor,
        idUser: payload.idPatient,
        dateRdv: dateRdv,
        typeRdv: payload.typeRdv,
        etatRdv: payload.etatRdv,
        heureDebut: heureDebut.toFormat('HH:mm'),
        heureFin: heureFin.toFormat('HH:mm'),
        description: payload.description,
      })

      return response.created({
        message: 'Rendez-vous créé avec succès.',
        data: appointment,
        note: attempts > 0 ? `Le créneau a été décalé de ${attempts * slotDurationMinutes} minutes.` : undefined
      })
    } catch (error) {
      console.error('[AppointmentController.create] Erreur :', error)
      return response.internalServerError({ message: 'Erreur serveur lors de la création du rendez-vous.' })
    }
  }
  /**
 * Récupérer les rendez-vous à venir d’un patient
 */
public async getUpcomingAppointmentsForPatient({ request, response }: HttpContextContract) {
  try {
    const idPatient = request.param('id') // ✅ récupérer depuis les paramètres de route

    if (!idPatient) {
      return response.badRequest({ message: 'idPatient est requis.' })
    }
    const today = DateTime.now().startOf('day')

    const appointments = await Appointment.query()
      .where('idUser', idPatient)
      .andWhere('dateRdv', '>=', today.toISODate())
      .orderBy('dateRdv', 'asc')
      .preload('doctor') // si tu veux les infos du médecin

    const result = appointments.map((appointment) => {
      const dateIso = appointment.dateRdv.toISODate()
      const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`)
      const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`)

      return {
        id: appointment.id,
        date: appointment.dateRdv.toISODate(),
        heureDebut: appointment.heureDebut,
        heureFin: appointment.heureFin,
        dateDebut: dateDebut.toISO(),
        dateFin: dateFin.toISO(),
        typeRdv: appointment.typeRdv,
        etatRdv: appointment.etatRdv,
        description: appointment.description,
        doctor: appointment.doctor ? {
          id: appointment.doctor.id,
          nom: appointment.doctor.first_name,
          prenom: appointment.doctor.last_name,
          email: appointment.doctor.email
        } : null
      }
    })

    return response.ok({
      message: 'Rendez-vous à venir récupérés avec succès.',
      appointments: result
    })
  } catch (error) {
    console.error('[getUpcomingAppointmentsForPatient] Erreur :', error)
    return response.internalServerError({
      message: 'Erreur serveur lors de la récupération des rendez-vous.',
      error: error.message
    })
  }
}

  
}
