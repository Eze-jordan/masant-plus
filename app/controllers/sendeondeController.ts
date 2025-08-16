import { DateTime } from 'luxon';
import cron from 'node-cron';
import Notification from '#models/notification';
import redis from '@adonisjs/redis/services/main';
import { EtatRDV } from '../enum/enums.js';
import Appointment from '#models/appointment';

export default class sendeondeController {

  public static async run() {
    try {
      console.log('Démarrage de l\'envoi des rappels...');
      const now = DateTime.local();
      const todayStart = now.startOf('day');
      const todayEnd = now.endOf('day');

      // Récupérer les rendez-vous d'aujourd'hui
      const upcomingAppointments = await Appointment.query()
        .whereBetween('dateRdv', [todayStart.toISO(), todayEnd.toISO()])
        .where('heureDebut', '>=', now.toFormat('HH:mm:ss'))
        .where('heureDebut', '<=', now.plus({ hours: 1 }).toFormat('HH:mm:ss'))
        .where('etatRdv', EtatRDV.CONFIRME)
        .preload('patient')
        .preload('doctor');

      console.log(`${upcomingAppointments.length} rendez-vous à rappeler.`);

      if (upcomingAppointments.length === 0) {
        console.log('Aucun rendez-vous à rappeler pour cette heure.');
        return;
      }

      // Traitement des notifications
      for (const appointment of upcomingAppointments) {
        await this.processAppointmentReminder(appointment, now);
      }

      console.log('Rappels envoyés avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des rappels:', error);
      throw error; // Propagation pour le scheduler
    }
  }

  private static async processAppointmentReminder(appointment: Appointment, now: DateTime) {
    const { patient, doctor,  } = appointment;
    console.log(now)
    const reminderMessage = `Rappel: Votre rendez-vous avec Dr. ${doctor.first_name} ${doctor.last_name} est prévu aujourd'hui à ${appointment.heureDebut}.`;

    try {
      console.log(`Envoi de rappel pour RDV ID ${appointment.id}...`);

      // Envoi des notifications push
      await Promise.all([
        patient.expoPushToken ? this.sendPushNotification(patient.expoPushToken, reminderMessage) : Promise.resolve(),
        doctor.expoPushToken ? this.sendPushNotification(doctor.expoPushToken, reminderMessage) : Promise.resolve()
      ]);

      // Création des notifications en base
      await Notification.createMany([
        { idUser: patient.id, description: reminderMessage },
        { idUser: doctor.id, description: reminderMessage }
      ]);

      console.log(`Rappel envoyé pour le RDV ID ${appointment.id}`);

    } catch (error) {
      console.error(`Erreur sur le RDV ${appointment.id}:`, error);
    }
  }

  private static async sendPushNotification(pushToken: string, message: string) {
    const notificationPayload = {
      to: pushToken,
      sound: 'default',
      title: 'Rappel de Rendez-vous',
      body: message,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),
      });

      const data: any = await response.json();
      if (data && data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }
      console.log('Notification envoyée avec succès.');
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification push:', error);
      throw error; // Rethrow pour capturer dans le bloc try-catch principal
    }
  }
}

class Scheduler {
  private static readonly JOB_KEY = 'reminder_job:last_execution';

  public static start() {
    cron.schedule('0 * * * *', async () => {
      console.log('[%s] Début du job de rappel...', new Date().toISOString());

      try {
        // Vérification de la dernière exécution
        const lastExec = await redis.get(this.JOB_KEY);
        if (lastExec) {
          console.log('Dernière exécution:', lastExec);
        } else {
          console.log('Aucune exécution précédente trouvée.');
        }

        // Exécution des rappels
        await sendeondeController.run();
        await redis.set(this.JOB_KEY, new Date().toISOString());

        console.log('[%s] Job terminé avec succès', new Date().toISOString());
      } catch (error) {
        console.error('Échec du job de rappel:', error);
        // Ici vous pourriez ajouter une notification d'erreur
      }
    });

    console.log('Scheduler démarré - vérification toutes les heures');
  }
}

export { Scheduler };
