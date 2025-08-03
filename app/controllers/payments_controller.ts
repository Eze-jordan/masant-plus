import { DateTime } from 'luxon'
import Paiement from '#models/paiement'
import Notification from '#models/notification'
import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusPaiement } from '../enum/enums.js'

export default class PaymentsController {
  public async getBalance({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId

      // On additionne les montants des paiements validés
      const result = await Paiement
        .query()
        .where('id_user', userId)
        .andWhere('statut', StatusPaiement.PAYE) // ou 'PAYE' si c’est string
        .sum('montant as total')

      const total = result[0]?.$extras.total ?? 0

      return response.ok({ userId, solde: Number(total) })
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
      const userId = params.userId

      // Get the start and end of the current month
      const startOfMonth = DateTime.now().startOf('month').toJSDate()
      const endOfMonth = DateTime.now().endOf('month').toJSDate()

      // Query the payments for the user within this month, and with 'PAYE' status
      const paiements = await Paiement
        .query()
        .where('idUser', userId)
        .andWhere('statut', 'PAYE') // 'PAYE' is the status for valid payments
        .andWhere('created_at', '>=', startOfMonth)
        .andWhere('created_at', '<=', endOfMonth)
        .preload('user') // Preload the user who made the payment

      // Calculate total earnings
      const total = paiements.reduce((acc, p) => acc + p.montant, 0)

      // Create notifications and send push notifications for each payment
      await Promise.all(paiements.map(async (paiement) => {
        // Create a notification for each payment
        await Notification.create({
          idUser: userId,
          titre: 'Nouveau paiement reçu',
          description: `Vous avez reçu un paiement de ${paiement.user?.first_name ?? 'un utilisateur'} pour un montant de ${paiement.montant} XFA.`,
          isRead: false,
        })

        // Get the expo push token of the user
        const user = await User.findOrFail(userId)

        // Send push notification if expoPushToken exists
        if (user.expoPushToken) {
          await this.sendPushNotification(user.expoPushToken, paiement.montant)
        }
      }))

      // Prepare payers data
      const payers = paiements.map((paiement) => ({
        payerId: paiement.user?.id,
        first_name: paiement.user?.first_name,
        fullName: `${paiement.user?.last_name ?? ''} ${paiement.user?.last_name ?? ''}`.trim(),
        montant: paiement.montant,
        paiementId: paiement.id,
      }))

      // Return the total earnings and the payers information
      return response.ok({
        userId,
        totalEarnings: total,
        payers,
      })
    } catch (error) {
      console.error('Erreur lors du calcul des gains du mois:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  /**
   * Send a push notification to the user via Expo.
   */
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
}
