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
      // Extraction des données de la requête
      const payload = request.only([
        'idDoctor',
        'idPatient',
        'date',
        'typeRdv',
        'etatRdv',
        'heureDebut',
        'heureFin',
        'description'
      ]);
  
      // Vérification de la validité de la date
      const dateRdv = DateTime.fromISO(payload.date);
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' });
      }
  
      // Convertir les heures en DateTime pour la même date
      let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`);
      let heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`);
  
      // Vérification de la validité des heures et si l'heure de fin est après l'heure de début
      if (!heureDebut.isValid || !heureFin.isValid || heureFin <= heureDebut) {
        return response.badRequest({ message: 'Heures invalides ou fin avant début.' });
      }
  
      // Calcul de la durée du créneau en minutes
      const slotDurationMinutes = heureFin.diff(heureDebut, 'minutes').minutes;
      console.log(slotDurationMinutes);
  
      // Récupérer les rendez-vous existants du docteur pour la date demandée
      const existingAppointments = await Appointment.query()
        .where('idDoctor', payload.idDoctor)
        .andWhere('dateRdv', dateRdv.toISODate());
  
      // Fonction pour vérifier si deux intervalles se chevauchent
      function isOverlapping(intervalA: Interval, intervalB: Interval) {
        return intervalA.overlaps(intervalB);
      }
  
      // Construire l'intervalle du rendez-vous demandé
      let requestedInterval = Interval.fromDateTimes(heureDebut, heureFin);
  
      // Vérifier si le créneau demandé chevauche un rendez-vous existant
      let hasOverlap = existingAppointments.some(app => {
        const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`);
        const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`);
        const appInterval = Interval.fromDateTimes(appStart, appEnd);
        return isOverlapping(requestedInterval, appInterval);
      });
  
      // Si un chevauchement est trouvé, renvoyer une erreur
      if (hasOverlap) {
        return response.badRequest({ message: 'Le créneau est déjà occupé.' });
      }
  
      // Définir les états valides
      const validStates = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  
      // Si l'état n'est pas valide, on le définit par défaut à "PENDING"
      const etatRdv = validStates.includes(payload.etatRdv) ? payload.etatRdv : 'PENDING';
  
      // Créer le rendez-vous avec les horaires et l'état validés
      const appointment = await Appointment.create({
        idDoctor: payload.idDoctor,
        idUser: payload.idPatient,
        dateRdv: dateRdv,
        typeRdv: payload.typeRdv,
        etatRdv: etatRdv,  // Utilisation de l'état validé
        heureDebut: heureDebut.toFormat('HH:mm'),
        heureFin: heureFin.toFormat('HH:mm'),
        description: payload.description,
      });
  
      // Retourner la réponse avec succès et les informations du rendez-vous créé
      return response.created({
        message: 'Rendez-vous créé avec succès.',
        data: appointment
      });
  
    } catch (error) {
      // En cas d'erreur serveur, retourner une réponse d'erreur
      console.error('[AppointmentController.create] Erreur :', error);
      return response.internalServerError({ message: 'Erreur serveur lors de la création du rendez-vous.' });
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
    const idUser = request.param('id');  // ID du médecin ou utilisateur

    if (!idUser) {
      return response.badRequest({ message: 'id utilisateur est requis.' });
    }

    // Filtrer uniquement les rendez-vous libres ou non confirmés
    const disponibilites = await Appointment.query()
      .where('idUser', idUser)  // Utilisation du bon nom de colonne 'idUser'
      .andWhere((query) => {
        query
          .whereNull('etatRdv')          // Rendez-vous sans état
          .orWhere('etatRdv', 'PENDING')   // Rendez-vous "libre"
          .orWhereNull('idUser');        // Rendez-vous sans patient (idUser null)
      })
      .orderBy('dateRdv', 'asc')
      .orderBy('heureDebut', 'asc');

    // Transformation des résultats
    const result = disponibilites.map((appointment) => {
      const dateIso = appointment.dateRdv.toISODate();
      const dateDebut = DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`);
      const dateFin = DateTime.fromISO(`${dateIso}T${appointment.heureFin}`);

      return {
        id: appointment.id,
        typeRdv: appointment.typeRdv,
        etatRdv: appointment.etatRdv ?? 'PENDING',  // Si etatRdv est null, utiliser 'libre'
        dateDebut: dateDebut.isValid ? dateDebut.toISO() : null,
        dateFin: dateFin.isValid ? dateFin.toISO() : null,
      };
    });

    return response.ok({
      message: `Disponibilités non prises pour l'utilisateur ${idUser}.`,
      disponibilites: result,
    });
  } catch (error) {
    console.error('[getUpcomingAppointmentsForPatient] Erreur :', error);
    return response.internalServerError({
      message: 'Erreur serveur lors de la récupération des disponibilités.',
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

}
