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
  
      // ... validations existantes ici ...
  
      const dateRdv = DateTime.fromISO(payload.date)
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' })
      }
  
      // Convertir heures en DateTime pour la même date
      let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`)
      let heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`)
  
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
  
      // Boucle pour trouver créneau libre (max 10 tentatives pour éviter boucle infinie)
      let attempts = 0
      const slotDurationMinutes = heureFin.diff(heureDebut, 'minutes').minutes
  
      while (
        existingAppointments.some(app => {
          const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`)
          const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`)
          const appInterval = Interval.fromDateTimes(appStart, appEnd)
          return isOverlapping(requestedInterval, appInterval)
        }) &&
        attempts < 10
      ) {
        // Décaler le créneau de la durée du rendez-vous (ex: +30 minutes)
        heureDebut = heureDebut.plus({ minutes: slotDurationMinutes })
        heureFin = heureFin.plus({ minutes: slotDurationMinutes })
        requestedInterval = Interval.fromDateTimes(heureDebut, heureFin)
        attempts++
      }
  
      if (attempts === 10) {
        return response.badRequest({ message: 'Impossible de trouver un créneau libre.' })
      }
  
      // Créer le rendez-vous avec le créneau libre trouvé
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
  
}
