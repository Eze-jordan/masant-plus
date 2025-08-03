import { DateTime } from 'luxon';
import cron from 'node-cron';
import Notification from '#models/notification';
import redis from '@adonisjs/redis/services/main';
import { EtatRDV } from '../enum/enums.js';
import Appointment from '#models/appointment';

/**
 * La classe SendReminderNotificationsJob gère l'envoi des rappels de rendez-vous
 */
export default class sendeondeController {
  
  /**
   * Méthode principale pour envoyer les notifications de rappel
   */
  public static async run() {
    try {
      console.log('Démarrage de l\'envoi des rappels...');
      const now = DateTime.local();
      
      // Récupérer les rendez-vous dont la date de rendez-vous est proche du délai de rappel
      const upcomingAppointments = await Appointment.query()
        .where('dateRdv', '>=', now.toSQLDate())  // Rendez-vous à venir après maintenant
        .where('dateRdv', '<=', now.plus({ hours: 1 }).toSQLDate())  // Rendez-vous dans l'heure
        .where('etatRdv', EtatRDV.CONFIRME) // Seulement les rendez-vous confirmés
        .preload('patient')                 // Charger le patient associé au rendez-vous
        .preload('doctor');                  // Charger le docteur associé au rendez-vous

      // Vérifier si des rendez-vous ont été récupérés
      console.log('Rendez-vous récupérés:', upcomingAppointments);

      if (upcomingAppointments.length === 0) {
        console.log('Aucun rendez-vous à rappeler pour cette heure.');
        return; // Si aucun rendez-vous, sortir de la méthode
      }

      // Parcourir chaque rendez-vous pour envoyer des rappels
      for (let appointment of upcomingAppointments) {
        const patient = appointment.patient;
        const doctor = appointment.doctor;

        // Vérifier les tokens
        console.log('Token Expo Patient:', patient.expoPushToken);
        console.log('Token Expo Docteur:', doctor.expoPushToken);

        const reminderMessage = `Rappel: Votre rendez-vous avec Dr. ${doctor.first_name} ${doctor.last_name} est prévu le ${appointment.dateRdv.toFormat('DD/MM/YYYY')} à ${appointment.heureDebut}.`;

        // Envoyer le rappel au patient si le token Expo existe
        if (patient.expoPushToken) {
          await this.sendPushNotification(patient.expoPushToken, reminderMessage);
        }

        // Envoyer le rappel au docteur si le token Expo existe
        if (doctor.expoPushToken) {
          await this.sendPushNotification(doctor.expoPushToken, reminderMessage);
        }

        // Créer une notification dans la base de données
        console.log('Création notification patient');
        await Notification.create({
          idUser: patient.id,
          description: reminderMessage,
        });

        console.log('Création notification docteur');
        await Notification.create({
          idUser: doctor.id,
          description: reminderMessage,
        });
      }
      
      console.log('Rappels envoyés avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des rappels:', error);
    }
  }

  /**
   * Envoie une notification push via Expo.
   * @param pushToken Le token Expo de l'utilisateur
   * @param message Le message de la notification
   */
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
      console.log('Réponse Expo:', data);

      if (data && typeof data === 'object' && 'errors' in data) {
        console.error('Erreur lors de l\'envoi de la notification Expo:', data.errors);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  }
}

/**
 * La classe Scheduler gère la planification et l'exécution des tâches récurrentes
 */
class Scheduler {
  // Planifier l'exécution de la tâche toutes les heures
  public static start() {
    cron.schedule('0 * * * *', async () => {
      console.log('Exécution du job de rappel...');

      try {
        // Ajouter des logs pour diagnostiquer
        console.log('Démarrer l\'envoi des notifications de rappel...');
        
        // Exécution du job de rappel
        await sendeondeController.run();

        // Optionnel : Utilisation de Redis pour ajouter un flag ou une entrée dans une file d'attente pour suivre les exécutions
        await redis.set('lastExecuted', new Date().toISOString());
      } catch (error) {
        console.error('Erreur lors de l\'exécution du job de rappel:', error);
      }
    });
  }
}

export { Scheduler };
