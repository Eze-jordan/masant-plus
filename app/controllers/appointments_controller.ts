import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime } from 'luxon'
import User from '#models/user'
import Notification from '#models/notification'

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
   * Lister tous les rendez-vous (admin) avec les données patient et médecin.
   * Accepts optional query params: doctorId, patientId, limit
   */
  public async listAllAppointments({ request, response }: HttpContextContract) {
    try {
      const doctorId = request.input('doctorId')
      const patientId = request.input('patientId')
      const limit = Number(request.input('limit')) || null

      const query = Appointment.query()

      if (doctorId) {
        query.where('idDoctor', doctorId)
      }

      if (patientId) {
        query.where('id_user', patientId)
      }

      // preload relations
      query.preload('patient').preload('doctor').preload('paiements').preload('prescription')
      query.orderBy('dateRdv', 'asc').orderBy('heureDebut', 'asc')

      if (limit) {
        query.limit(limit)
      }

      const appointments = await query

      const result = appointments.map((appointment) => {
        const dateIso = appointment.dateRdv?.toISODate ? appointment.dateRdv.toISODate() : null
        const dateDebut = dateIso && appointment.heureDebut ? DateTime.fromISO(`${dateIso}T${appointment.heureDebut}`) : null
        const dateFin = dateIso && appointment.heureFin ? DateTime.fromISO(`${dateIso}T${appointment.heureFin}`) : null

        return {
          id: appointment.id,
          typeRdv: appointment.typeRdv,
          etatRdv: appointment.etatRdv,
          dateDebut: dateDebut && dateDebut.isValid ? dateDebut.toISO() : null,
          dateFin: dateFin && dateFin.isValid ? dateFin.toISO() : null,
          description: appointment.description,
          paiements: appointment.paiements || [],
          prescription: appointment.prescription || null,
          patient: appointment.patient
            ? {
                id: appointment.patient.id,
                first_name: appointment.patient.first_name,
                last_name: appointment.patient.last_name,
                email: appointment.patient.email,
                phone: appointment.patient.phone,
                profileImage: (appointment.patient as any)['profileImage'] ?? (appointment.patient as any)['profile_image'],
              }
            : null,
          doctor: appointment.doctor
            ? {
                id: appointment.doctor.id,
                first_name: appointment.doctor.first_name,
                last_name: appointment.doctor.last_name,
                email: appointment.doctor.email,
                phone: appointment.doctor.phone,
                profileImage: (appointment.doctor as any)['profileImage'] ?? (appointment.doctor as any)['profile_image'],
              }
            : null,
        }
      })

      return response.ok({ appointments: result })
    } catch (error) {
      console.error('[listAllAppointments] Erreur :', error)
      return response.internalServerError({ message: 'Erreur lors de la récupération des rendez-vous.' })
    }
  }

  /**
   * Créer un nouveau rendez-vous
   */





public async getAppointmentsForPatient({ request, response }: HttpContextContract) {
  try {
    const idUser = request.param('id'); // ID du patient passé en paramètre
    if (!idUser) {
      return response.badRequest({ message: 'ID patient est requis.' });
    }

    const now = DateTime.local(); // Obtient l'heure actuelle
    console.log('Date actuelle:', now.toISO()); // Log la date actuelle pour débogage

    // Vérifier si le patient existe
    const patient = await User.find(idUser);
    if (!patient) {
      return response.notFound({ message: 'Patient non trouvé.' });
    }

    // Recherche des rendez-vous (tous, à venir, passés, récurrents)
    const appointments = await Appointment.query()
      .where('id_user', idUser) // Filtre par l'ID du patient (id_user)
      .preload('doctor') // Précharge les informations sur le médecin
      .orderBy('dateRdv', 'asc') // Trie par date de rendez-vous
      .orderBy('heureDebut', 'asc'); // Trie par heure de début

    console.log('Rendez-vous trouvés :', appointments); // Log les rendez-vous récupérés

    if (appointments.length === 0) {
      return response.ok({
        message: `Aucun rendez-vous trouvé pour le patient ${idUser}.`,
        appointments: [],
      });
    }

    // Traitement des rendez-vous récupérés
    const result = appointments.map((appointment) => this.formatAppointment(appointment));

    // Retourner les rendez-vous avec un message explicite
    return response.ok({
      message: `Rendez-vous pour le patient ${idUser}.`,
      appointments: result,
    });
  } catch (error) {
    console.error('[getAppointmentsForPatient] Erreur :', error);

    return response.internalServerError({
      message: 'Erreur serveur lors de la récupération des rendez-vous.',
      error: error.message,
    });
  }
}

// Fonction pour formater un rendez-vous
private formatAppointment(appointment: Appointment) {
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
}


  // Méthode pour créer un rendez-vous
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
      'idCreneau',
    ]);

    console.log('Payload:', payload);

    // Vérification des champs obligatoires
    const requiredFields = ['idDoctor', 'idPatient', 'date', 'typeRdv', 'etatRdv', 'idCreneau'];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      return response.badRequest({
        message: `Champs requis manquants : ${missingFields.join(', ')}`,
      });
    }

    // Validation des valeurs d'enum
    if (!Object.keys(TypeRDV).includes(payload.typeRdv)) {
      return response.badRequest({ message: `typeRdv invalide : ${payload.typeRdv}` });
    }

    if (!Object.keys(EtatRDV).includes(payload.etatRdv)) {
      return response.badRequest({ message: `etatRdv invalide : ${payload.etatRdv}` });
    }

    // Validation de la date (ne pas permettre les dates passées)
    const dateRdv = DateTime.fromISO(payload.date);
    const now = DateTime.now();
    
    if (!dateRdv.isValid) {
      return response.badRequest({ message: 'Date invalide.' });
    }

    if (dateRdv < now.startOf('day')) {
      return response.badRequest({ message: 'Impossible de créer un rendez-vous dans le passé.' });
    }

    // Validation des heures
    const heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`);
    const heureFin = DateTime.fromISO(`${payload.date}T${payload.heureFin}`);

    if (!heureDebut.isValid || !heureFin.isValid) {
      return response.badRequest({ message: 'Format d\'heure invalide.' });
    }

    if (heureFin <= heureDebut) {
      return response.badRequest({ message: 'L\'heure de fin doit être après l\'heure de début.' });
    }

    // Vérifier que le créneau n'est pas déjà utilisé (au niveau base de données)
    const existingCreneau = await Appointment.query()
      .where('idCreneau', payload.idCreneau)
      .andWhereNot('etatRdv', EtatRDV.ANNULE)
      .first();

    if (existingCreneau) {
      return response.badRequest({ 
        message: 'Ce créneau est déjà réservé. Veuillez choisir un autre créneau.' 
      });
    }

    // Vérification des conflits de créneaux pour le médecin (plus précise)
    const existingDoctorAppointments = await Appointment.query()
      .where('idDoctor', payload.idDoctor)
      .andWhere('dateRdv', dateRdv.toISODate())
      .andWhereNot('etatRdv', EtatRDV.ANNULE);

    // Vérification des conflits de créneaux pour le patient (plus précise)
    const existingPatientAppointments = await Appointment.query()
      .where('idUser', payload.idPatient)
      .andWhere('dateRdv', dateRdv.toISODate())
      .andWhereNot('etatRdv', EtatRDV.ANNULE);

    // Vérifier les chevauchements exacts pour le médecin
    const hasDoctorOverlap = existingDoctorAppointments.some((app) => {
      const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`);
      const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`);
      
      // Vérifier le chevauchement exact des heures
      return (
        (heureDebut >= appStart && heureDebut < appEnd) ||
        (heureFin > appStart && heureFin <= appEnd) ||
        (heureDebut <= appStart && heureFin >= appEnd)
      );
    });

    if (hasDoctorOverlap) {
      return response.badRequest({ 
        message: 'Le médecin a déjà un rendez-vous sur ce créneau horaire.' 
      });
    }

    // Vérifier les chevauchements exacts pour le patient
    const hasPatientOverlap = existingPatientAppointments.some((app) => {
      const appStart = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureDebut}`);
      const appEnd = DateTime.fromISO(`${app.dateRdv.toISODate()}T${app.heureFin}`);
      
      // Vérifier le chevauchement exact des heures
      return (
        (heureDebut >= appStart && heureDebut < appEnd) ||
        (heureFin > appStart && heureFin <= appEnd) ||
        (heureDebut <= appStart && heureFin >= appEnd)
      );
    });

    if (hasPatientOverlap) {
      return response.badRequest({ 
        message: 'Le patient a déjà un rendez-vous sur ce créneau horaire.' 
      });
    }

    // Vérifier que le patient n'est pas le médecin
    if (payload.idDoctor === payload.idPatient) {
      return response.badRequest({ 
        message: 'Un médecin ne peut pas prendre rendez-vous avec lui-même.' 
      });
    }

    // Vérifier l'existence du médecin et du patient
    const doctor = await User.find(payload.idDoctor);
    const patient = await User.find(payload.idPatient);

    if (!doctor) {
      return response.badRequest({ message: 'Médecin non trouvé.' });
    }

    if (!patient) {
      return response.badRequest({ message: 'Patient non trouvé.' });
    }

    // Création du rendez-vous avec transaction pour plus de sécurité
    const appointment = await Appointment.create({
      idDoctor: payload.idDoctor,
      idUser: payload.idPatient,
      dateRdv: dateRdv,
      typeRdv: payload.typeRdv,
      etatRdv: payload.etatRdv,
      heureDebut: payload.heureDebut,
      heureFin: payload.heureFin,
      description: payload.description,
      idCreneau: payload.idCreneau,
    });

    console.log('Rendez-vous créé:', appointment);

    // Notification au patient
    await this.sendAppointmentNotification(patient, appointment, payload);

    return response.created({
      message: 'Rendez-vous créé avec succès.',
      appointment: appointment
    });

  } catch (error) {
    console.error('[AppointmentController.create] Erreur :', error);
    return response.internalServerError({
      message: 'Erreur serveur lors de la création du rendez-vous.',
      error: error.message,
    });
  }
}

// Méthode séparée pour l'envoi de notifications
private async sendAppointmentNotification(patient: User, appointment: Appointment, payload: any) {
  try {
    const patientName = `${patient.first_name} ${patient.last_name}`;

    // Créer la notification
    const notification = await Notification.create({
      idUser: payload.idPatient,
      titre: 'Rendez-vous confirmé',
      description: `Cher ${patientName}, votre rendez-vous a été confirmé pour le ${payload.date} à ${payload.heureDebut}.`,
      isRead: false,
    });

    console.log('Notification créée:', notification);

    // Notification push si le token existe
    if (patient.expoPushToken) {
      const pushBody = {
        to: patient.expoPushToken,
        title: notification.titre,
        body: notification.description,
        data: { appointmentId: appointment.id },
      };

      try {
        const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pushBody),
        });

        const responseData = await pushResponse.json();

        if (responseData && typeof responseData === 'object') {
          if ('errors' in responseData) {
            console.error('Erreur de notification push:', responseData.errors);
          } else {
            console.log('Notification push envoyée avec succès:', responseData);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification push:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
}
  /**
   * Annuler un rendez-vous
   */
  /**
 * Annuler un rendez-vous - VERSION CORRIGÉE
 */
public async cancel({ params, response }: HttpContextContract) {
  try {
    const appointmentId = params.id // ← Utiliser params.id au lieu de request.input('id')
    
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
