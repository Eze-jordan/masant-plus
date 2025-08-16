import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime, Interval } from 'luxon'
import Creneau from '#models/creneau'


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
        .preload('review')

      // Transformation des données
      const result = appointments.map((appointment) => {
        const dateIso = appointment.dateRdv.toISODate() // ex: "2025-08-01"
        const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`, { zone: 'local' })
        const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`, { zone: 'local' })

        return {
          id: appointment.id,
          typeRdv: appointment.typeRdv,
          etatRdv: appointment.etatRdv,
<<<<<<< HEAD

=======
          idPatient: appointment.patient?.id ?? null,
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
          nomPatient: appointment.patient?.first_name ?? null,
          prenomPatient: appointment.patient?.last_name ?? null,
          paiements: appointment.paiements,
          description: appointment.description,
          prescription: appointment.prescription,
          review: appointment.review,
          dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
          dateFin: dateFin.isValid ? dateFin.toISO() : null,
        }
      })

      // ✅ Tri chronologique par dateDebut
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
<<<<<<< HEAD
public async create({ request, response }: HttpContextContract) {
  try {
    const payload = request.only([
      'idDoctor',
      'idPatient',
      'date',
      'typeRdv',
      'etatRdv',
      'description',
      'idCreneau', // Ensure you add the idCreneau field
    ])

    // Vérification des champs obligatoires
    if (!payload.idDoctor || !payload.idPatient || !payload.date || !payload.typeRdv || !payload.etatRdv || !payload.idCreneau) {
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

    // Créer l'appointment avec le idCreneau inclus
=======




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

    const dateRdv = DateTime.fromISO(payload.date)
    if (!dateRdv.isValid) {
      return response.badRequest({ message: 'Date invalide.' })
    }

    let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`)
    let heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`)

    if (!heureDebut.isValid || !heureFin.isValid || heureFin <= heureDebut) {
      return response.badRequest({ message: 'Heures invalides ou fin avant début.' })
    }

    const existingAppointments = await Appointment.query()
      .where('idDoctor', payload.idDoctor)
      .andWhere('dateRdv', dateRdv.toISODate())

    function isOverlapping(intervalA: Interval, intervalB: Interval) {
      return intervalA.overlaps(intervalB)
    }

    let requestedInterval = Interval.fromDateTimes(heureDebut, heureFin)

    let hasOverlap = existingAppointments.some(app => {
      const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`)
      const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`)
      const appInterval = Interval.fromDateTimes(appStart, appEnd)
      return isOverlapping(requestedInterval, appInterval)
    })

    if (hasOverlap) {
      return response.badRequest({ message: 'Le créneau est déjà occupé.' })
    }

    const validStates = ['PENDING', 'CONFIRMED', 'CANCELLED']
    const etatRdv = validStates.includes(payload.etatRdv) ? payload.etatRdv : 'PENDING'

    // Création du rendez-vous avec idCreneau inclus
>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
    const appointment = await Appointment.create({
      idDoctor: payload.idDoctor,
      idUser: payload.idPatient,
      dateRdv: dateRdv,
      typeRdv: payload.typeRdv,
<<<<<<< HEAD
      etatRdv: payload.etatRdv,
      heureDebut: '', // à personnaliser
      heureFin: '',  // idem
      idCreneau: payload.idCreneau, // Ajoutez l'ID du créneau
    })

    return response.created(appointment)
  } catch (error) {
    console.error('[AppointmentController.create] Erreur :', error)
    return response.internalServerError({ message: 'Erreur serveur lors de la création du rendez-vous.' })
  }
}

=======
      etatRdv: etatRdv,
      heureDebut: heureDebut.toFormat('HH:mm'),
      heureFin: heureFin.toFormat('HH:mm'),
      description: payload.description,
      idCreneau: payload.idCreneau,  // Ajout du champ ici
    })

    // Mise à jour du créneau en tant qu'utilisé
    if (payload.idCreneau) {
      try {
        const creneau = await Creneau.findOrFail(payload.idCreneau)

        if (creneau.isUsed) {
          console.warn(`Le créneau ${payload.idCreneau} est déjà marqué comme utilisé.`)
        } else {
          creneau.isUsed = true
          await creneau.save()
          console.log(`Créneau ${payload.idCreneau} mis à jour avec succès.`)
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du créneau :', error)
      }
    }

    return response.created({
      message: 'Rendez-vous créé avec succès.',
      id: appointment.id,
      data: appointment,
    })
  } catch (error) {
    console.error('[AppointmentController.create] Erreur :', error)
    return response.internalServerError({
      message: 'Erreur serveur lors de la création du rendez-vous.',
      error: error.message,
    })
  }
}

  /**
 * Récupérer les rendez-vous à venir d’un patient
 */
 /**
   * Récupérer tous les rendez-vous pour un patient donné (sans filtre de date)

 public async getUpcomingAppointmentsForPatient({ request, response }: HttpContextContract) {
  try {
    const idUser = request.param('id')

    console.log('ID utilisateur reçu:', idUser)

    if (!idUser) {
      return response.badRequest({ message: 'id utilisateur est requis.' })
    }

    const appointments = await Appointment.query()
      .where('id_user', idUser) // Assure-toi que c’est bien 'id_user' dans ta base
      .orderBy('dateRdv', 'asc')
      .orderBy('heureDebut', 'asc')
      .preload('patient')
      .preload('doctor')
      .preload('paiements')
      .preload('prescription')
      .preload('review')

    console.log('Nombre de rendez-vous trouvés:', appointments.length)

    const result = appointments.map((appointment) => {
      const dateIso = appointment.dateRdv.toISODate()
      const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`)
      const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`)

      return {
        id: appointment.id,
        typeRdv: appointment.typeRdv,
        etatRdv: appointment.etatRdv,
        prenomPatient: appointment.patient?.first_name ?? null,
        nomPatient: appointment.patient?.last_name ?? null,
        paiements: appointment.paiements ?? [],
        prescription: appointment.prescription ?? null,
        review: appointment.review ?? [],
        dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
        dateFin: dateFin.isValid ? dateFin.toISO() : null,
        doctor: appointment.doctor
          ? {
              id: appointment.doctor.id,
              nom: appointment.doctor.first_name,
              prenom: appointment.doctor.last_name,
              email: appointment.doctor.email,
            }
          : null,
      }
    })

    return response.ok({
      message: 'Tous les rendez-vous récupérés avec succès.',
      appointments: result,
    })
  } catch (error) {
    console.error('[getAppointmentsForUser] Erreur :', error)
    return response.internalServerError({
      message: 'Erreur serveur lors de la récupération des rendez-vous.',
      error: error.message,
    })
  }
}
   */
public async getUpcomingAppointmentsForPatient({ request, response }: HttpContextContract) {
  try {
    const idUser = request.param('id'); // id patient
    if (!idUser) {
      return response.badRequest({ message: 'ID patient est requis.' });
    }

    const now = DateTime.local();

    const appointments = await Appointment.query()
      .where('idUser', idUser)               // rendez-vous du patient
      .andWhere('dateRdv', '>=', now.toISODate())
      .andWhere('etatRdv', EtatRDV.CONFIRME) // par exemple seulement les confirmés
      .orderBy('dateRdv', 'asc')
      .orderBy('heureDebut', 'asc');

    const result = appointments.map((appointment) => {
      const dateIso = appointment.dateRdv.toISODate();
      const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`);
      const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`);

      return {
        id: appointment.id,
        typeRdv: appointment.typeRdv,
        etatRdv: appointment.etatRdv ?? 'PENDING',
        dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
        dateFin: dateFin.isValid ? dateFin.toISO() : null,
      };
    });

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


/**
 * Annuler un rendez-vous (par le médecin ou le patient)
 * Ex: PUT /appointments/:id/cancel
 */
public async cancel({ params, response }: HttpContextContract) {
  try {
    const appointmentId = params.id

    if (!appointmentId) {
      return response.badRequest({ message: 'ID du rendez-vous requis.' })
    }

    const appointment = await Appointment.find(appointmentId)

    if (!appointment) {
      return response.notFound({ message: 'Rendez-vous non trouvé.' })
    }

    if (appointment.etatRdv === 'ANNULE') {
      return response.badRequest({ message: 'Ce rendez-vous est déjà annulé.' })
    }

    appointment.etatRdv = 'ANNULE' // Utilise bien la valeur du champ dans ton enum EtatRDV
    await appointment.save()

    return response.ok({
      message: 'Rendez-vous annulé avec succès.',
      data: appointment
    })

  } catch (error) {
    console.error('[cancel] Erreur :', error)
    return response.internalServerError({
      message: 'Erreur serveur lors de l’annulation du rendez-vous.',
      error: error.message
    })
  }
}

>>>>>>> 6f506420a02e20676352333842b78602f55cbfe5
}
