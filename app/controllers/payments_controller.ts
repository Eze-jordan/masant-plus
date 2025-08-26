import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusPaiement } from '../enum/enums.js'
import Appointment from '#models/appointment'
import Paiement from '#models/paiement';

export default class PaymentsController {
  public async getBalance({ params, response }: HttpContextContract) {
  try {
    const { doctorId } = params; // ID du médecin

    // Récupérer les rendez-vous du médecin, avec les paiements validés
    const appointments = await Appointment.query()
      .where('idDoctor', doctorId)
      .preload('paiements', (query) => {
        query.where('statut', StatusPaiement.PAYE); // seulement les paiements validés
      });

    // Calcul du total sécurisé
    const total = appointments.reduce((sum, appointment) => {
      // Vérifier que la relation paiements est bien un tableau
      const paiements = Array.isArray(appointment.paiements) ? appointment.paiements : [];

      // Calculer le total des paiements pour ce rendez-vous
      const paiementTotal = paiements.reduce((appointmentSum, paiement) => {
        // Sécuriser la conversion du montant en nombre
        const montant = Number(paiement?.montant);
        return appointmentSum + (Number.isFinite(montant) ? montant : 0);
      }, 0);

      return sum + paiementTotal;
    }, 0);

    // Sécuriser la réponse : si total est NaN, retourner 0
    const solde = Number.isFinite(total) ? total : 0;

    return response.ok({ doctorId, solde });

  } catch (error) {
    console.error('Erreur lors du calcul du solde:', error);
    return response.status(500).json({ message: 'Erreur serveur' });
  }
}

  /**
   * Retrieve the total earnings for the user in the current month
   * and send a push notification for each valid payment.
   */

 public async getMonthlyEarnings({ params, response }: HttpContextContract) {
    try {
      const { doctorId } = params  // ID du médecin passé en paramètre

      // Obtenir le début et la fin du mois en cours
      const startOfMonth = DateTime.now().startOf('month').toJSDate()
      const endOfMonth = DateTime.now().endOf('month').toJSDate()

      // Récupérer tous les rendez-vous associés au médecin spécifié (idDoctor) pour le mois en cours
      const appointments = await Appointment.query()
        .where('idDoctor', doctorId)  // Filtrer par l'ID du médecin (idDoctor)
        .preload('paiements', (query) => {
          query
            .where('statut', StatusPaiement.PAYE)  // Filtrer les paiements validés
            .whereBetween('created_at', [startOfMonth, endOfMonth])  // Filtrer les paiements dans le mois en cours
            .preload('user')  // Précharger la relation 'user' pour récupérer les informations du payeur
        })

      // Calculer la somme de tous les paiements validés pour ce médecin dans le mois
      let total = 0;

      // Typage explicite de payers : tableau contenant des objets avec les propriétés définies
      const payers: {
        paiementId: string;
        first_name: string;
        last_name: string;
        montant: number;
        timestamp: number;
      }[] = []  // Liste pour stocker les payeurs

      appointments.forEach(appointment => {
        appointment.paiements.forEach(paiement => {
          const montant = Number(paiement.montant) || 0;  // Assurer que le montant est un nombre valide
          total += montant;

          // Ajouter chaque payeur à la liste avec les propriétés attendues
          payers.push({
            paiementId: paiement.id,
            first_name: paiement.user.first_name || "",  // Valeur par défaut si undefined
            last_name: paiement.user.last_name || "",
            montant,
            timestamp: paiement.datePaiement.toMillis()  // Utiliser `datePaiement` qui est un `DateTime`
          });
        });
      });

      // Vérifier si 'total' est bien un nombre avant d'appeler 'toFixed'
      if (isNaN(total)) {
        throw new Error("Le total des paiements n'est pas un nombre valide");
      }

      // Retourner les informations formatées comme demandé
      return response.ok({
        doctorId,
        totalEarnings: total.toFixed(2),  // Le total arrondi à deux décimales
        solde: total.toFixed(2),  // Solde (identique au total dans ce cas)
        payers
      });

    } catch (error) {
      console.error('Erreur lors du calcul du solde:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
 public async getPaymentsByPatient({ params, response }: HttpContextContract) {
    try {
const { id: patientId } = params
      if (!patientId) {
        return response.status(400).json({ message: 'ID du patient manquant' })
      }
      const paiements = await Paiement.query()
        .where('user_id', patientId)
        .where('statut', 'PAYE')
        .preload('appointment', (appointmentQuery) => {
          appointmentQuery
            .preload('doctor')     // Pour obtenir le nom du médecin
            .preload('creneau')    // Pour accéder à la date du créneau
        })

      const payments = paiements.map((paiement) => {
        const appointment = paiement.appointment
        const doctor = appointment?.doctor
        const creneau = appointment?.creneau

        return {
          doctorId: doctor?.id || null,
          doctorName: doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Inconnu',
          dateCreneau: creneau?.date || null, // déjà un string au format "YYYY-MM-DD"
          datePaiement: paiement.datePaiement
            ? paiement.datePaiement.toFormat('dd/MM/yyyy HH:mm')
            : null,
          description: appointment.description || null,
          montant: Number(paiement.montant) || 0,
        }
      })

      return response.ok({
        patientId,
        payments,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements du patient:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  /**
   * Send a push notification to the user via Expo.

  private async sendPushNotification(expoPushToken: string, amount: number) {
    try {
      // Prepare the message for the push notification
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Paiement reçu',
        body: `Vous avez reçu un paiement de ${amount} XFA.`,
        data: { withSome: 'data' }, // Custom data for the app can be included here
      }

      // Send the push notification using fetch
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),  // Convert the message to a JSON string
      })

      // Check for response status
      if (!response.ok) {
        const error = await response.json()
        console.error('Erreur lors de l\'envoi de la notification:', error)
      } else {
        console.log('Push notification sent successfully')
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification push:', error)
    }
  }
  */
}
