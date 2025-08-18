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

      // Transformation des données
      const result = appointments.map((appointment) => {
        const dateIso = appointment.dateRdv.toISODate()
        const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`, { zone: 'local' })
        const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`, { zone: 'local' })

        return {
          id: appointment.id,
          typeRdv: appointment.typeRdv,
          etatRdv: appointment.etatRdv,
          idPatient: appointment.patient?.id ?? null,
          nomPatient: appointment.patient?.first_name ?? null,
          prenomPatient: appointment.patient?.last_name ?? null,
          paiements: appointment.paiements,
          description: appointment.description,
          prescription: appointment.prescription,
          dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
          dateFin: dateFin.isValid ? dateFin.toISO() : null,
        }
      })

      // Tri chronologique par dateDebut
      result.sort((a, b) => {
        const dateA = a.dateDebut ? DateTime.fromISO(a.dateDebut) : DateTime.invalid('Invalid')
        const dateB = b.dateDebut ? DateTime.fromISO(b.dateDebut) : DateTime.invalid('Invalid')
        return dateA.toMillis() - dateB.toMillis()
      })

      return response.ok(result)
    } catch (error) {
      console.error('[getAppointmentsForDoctor] Erreur :', error)
      return response.internalServerError({
        message: 'Erreur serveur lors de la récupération des rendez-vous.'
      })
    }
  }

  /**
   * Créer un nouveau rendez-vous
   */



  public async getUpcomingAppointmentsForPatient({ request, response }: HttpContextContract) {
    try {
      const idUser = request.param('id'); // ID du patient passé en paramètre
      if (!idUser) {
        return response.badRequest({ message: 'ID patient est requis.' });
      }

      const now = DateTime.local(); // Obtient l'heure actuelle

      // Recherche des rendez-vous confirmés à venir pour un patient donné
      const appointments = await Appointment.query()
        .where('idUser', idUser) // Filtre par l'ID du patient
        .andWhere('dateRdv', '>=', now.toISODate()) // Filtre les rendez-vous à venir
        .andWhere('etatRdv', EtatRDV.CONFIRME) // Seuls les rendez-vous confirmés
        .preload('doctor') // Précharge les informations sur le médecin
        .orderBy('dateRdv', 'asc') // Trie par date de rendez-vous
        .orderBy('heureDebut', 'asc'); // Trie par heure de début

      // Traitement des rendez-vous récupérés
      const result = appointments.map((appointment) => {
        // Vérifier si le médecin est bien chargé
        const doctor = appointment.doctor || { first_name: 'Inconnu', last_name: 'Inconnu' };

        const dateIso = appointment.dateRdv.toISODate();
        const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`);
        const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`);

        return {
          id: appointment.id,
          typeRdv: appointment.typeRdv,
          etatRdv: appointment.etatRdv ?? 'PENDING', // Si l'état est vide, mettre 'PENDING'
          dateDebut: dateDebut.isValid ? dateDebut.toISO() : null, // Format ISO de la date de début
          dateFin: dateFin.isValid ? dateFin.toISO() : null, // Format ISO de la date de fin
          doctor: `${doctor.first_name} ${doctor.last_name}`, // Nom complet du médecin
          doctorId: appointment.idDoctor, // ID du médecin
        };
      });

      // Retourner les rendez-vous avec un message explicite
      return response.ok({
        message: `Rendez-vous à venir pour le patient ${idUser}.`,
        appointments: result,
      });
    } catch (error) {
      console.error('[getUpcomingAppointmentsForPatient] Erreur :', error);

      return response.internalServerError({
        message: 'Erreur serveur lors de la récupération des rendez-vous.',
        error: error.message,
      });
    }
  }
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
        'description',
        'idCreneau'
      ])
console.log('Payload:', payload);

      // Vérification des champs obligatoires
      const requiredFields = ['idDoctor', 'idPatient', 'date', 'typeRdv', 'etatRdv', 'idCreneau']
      const missingFields = requiredFields.filter(field => !payload[field])

      if (missingFields.length > 0) {
        return response.badRequest({
          message: `Champs requis manquants : ${missingFields.join(', ')}`
        })
      }

      // Validation des valeurs d'enum
      if (!Object.keys(TypeRDV).includes(payload.typeRdv)) {
        return response.badRequest({ message: `typeRdv invalide : ${payload.typeRdv}` })
      }

      if (!Object.keys(EtatRDV).includes(payload.etatRdv)) {
        return response.badRequest({ message: `etatRdv invalide : ${payload.etatRdv}` })
      }

      // Validation de la date
      const dateRdv = DateTime.fromISO(payload.date)
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' })
      }

      // Validation des heures
      let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`)
      let heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`)

      if (!heureDebut.isValid || !heureFin.isValid || heureFin <= heureDebut) {
        return response.badRequest({ message: 'Heures invalides ou fin avant début.' })
      }

      // Vérification des conflits de créneaux
      const existingAppointments = await Appointment.query()
        .where('idDoctor', payload.idDoctor)
        .andWhere('dateRdv', dateRdv.toISODate())

      const requestedInterval = Interval.fromDateTimes(heureDebut, heureFin)
      const hasOverlap = existingAppointments.some(app => {
        const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`)
        const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`)
        const appInterval = Interval.fromDateTimes(appStart, appEnd)
        return requestedInterval.overlaps(appInterval)
      })

      if (hasOverlap) {
        return response.badRequest({ message: 'Le créneau est déjà occupé.' })
      }

      // Création du rendez-vous
      const appointment = await Appointment.create({
        idDoctor: payload.idDoctor,
        idUser: payload.idPatient,
        dateRdv: dateRdv,
        typeRdv: payload.typeRdv,
        etatRdv: payload.etatRdv,
        heureDebut: payload.heureDebut,
        heureFin: payload.heureFin,
        description: payload.description,
        idCreneau: payload.idCreneau
      })

      return response.created(appointment)
    } catch (error) {
      console.error('[AppointmentController.create] Erreur :', error)
      return response.internalServerError({
        message: 'Erreur serveur lors de la création du rendez-vous.',
        error: error.message
      })
    }
  }

  /**
   * Annuler un rendez-vous
   */
  public async cancel({ request, response }: HttpContextContract) {
    try {
      const appointmentId = request.input('id')
      if (!appointmentId) {
        return response.badRequest({ message: 'ID du rendez-vous requis.' })
      }

      const appointment = await Appointment.findOrFail(appointmentId)
      appointment.etatRdv = EtatRDV.ANNULE
      await appointment.save()

      return response.ok({
        message: 'Rendez-vous annulé avec succès.',
        appointment
      })
    } catch (error) {
      console.error('[cancel] Erreur :', error)
      return response.internalServerError({
        message: 'Erreur serveur lors de l\'annulation du rendez-vous.',
        error: error.message
      })
    }
  }
}
