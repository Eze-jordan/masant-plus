import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Paiement from '#models/paiement'
import { DateTime } from 'luxon' // ou dayjs/moment selon ton setup
import { StatusPaiement } from '../enum/enums.js'
import Notification from '#models/notification'

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
  public async getMonthlyEarnings({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId
  
      const startOfMonth = DateTime.now().startOf('month').toJSDate()
      const endOfMonth = DateTime.now().endOf('month').toJSDate()
  
      const paiements = await Paiement
        .query()
        .where('idUser', userId)
        .andWhere('statut', StatusPaiement.PAYE)
        .andWhere('created_at', '>=', startOfMonth)
        .andWhere('created_at', '<=', endOfMonth)
        .preload('user') // charger le payeur
  
      const total = paiements.reduce((acc, p) => acc + p.montant, 0)
  
      // Créer une notification pour chaque paiement
      await Promise.all(paiements.map(async (paiement) => {
        await Notification.create({
          idUser: userId,
          titre: 'Nouveau paiement reçu',
          description: `Vous avez reçu un paiement de ${paiement.user?.username ?? 'un utilisateur'} pour un montant de ${paiement.montant}xfa.`,
          isRead: false,
        })
      }))
  
      const payers = paiements.map((paiement) => ({
        payerId: paiement.user?.id,
        username: paiement.user?.username,
        fullName: `${paiement.user?.firstName ?? ''} ${paiement.user?.lastName ?? ''}`.trim(),
        montant: paiement.montant,
        paiementId: paiement.id,
      }))
  
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
}
