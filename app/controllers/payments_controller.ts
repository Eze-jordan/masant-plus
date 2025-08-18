import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusPaiement } from '../enum/enums.js'
import Appointment from '#models/appointment'

export default class PaymentsController {
public async getBalance({ params, response }: HttpContextContract) {
    try {
      const { doctorId } = params  // ID du médecin passé en paramètre

      // Récupérer tous les rendez-vous associés au médecin spécifié (idDoctor)
      const appointments = await Appointment.query()
        .where('idDoctor', doctorId)  // Filtrer par l'ID du médecin (idDoctor)
        .preload('paiements', (query) => {
          query.where('statut', StatusPaiement.PAYE)  // Filtrer les paiements validés
        })

      // Calculer la somme de tous les paiements validés pour ce médecin
      const total = appointments.reduce((sum, appointment) => {
        const paiementTotal = appointment.paiements.reduce((appointmentSum, paiement) => {
          return appointmentSum + (paiement.montant || 0)  // Additionner les montants des paiements validés
        }, 0)

        return sum + paiementTotal  // Ajouter au total global
      }, 0)

      // Retourner uniquement le solde total du médecin
      return response.ok({ doctorId, solde: Number(total) })

    } catch (error) {
      console.error('Erreur lors du calcul du solde:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
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
          query.where('statut', StatusPaiement.PAYE)  // Filtrer les paiements validés
            .whereBetween('created_at', [startOfMonth, endOfMonth])  // Filtrer les paiements dans le mois en cours
        })

      // Calculer la somme de tous les paiements validés pour ce médecin dans le mois
      const total = appointments.reduce((sum, appointment) => {
        const paiementTotal = appointment.paiements.reduce((appointmentSum, paiement) => {
          return appointmentSum + (paiement.montant || 0)  // Additionner les montants des paiements validés
        }, 0)

        return sum + paiementTotal  // Ajouter au total global
      }, 0)

      // Retourner uniquement le solde total du médecin pour le mois en cours
      return response.ok({ doctorId, solde: Number(total) })

    } catch (error) {
      console.error('Erreur lors du calcul du solde:', error)
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
