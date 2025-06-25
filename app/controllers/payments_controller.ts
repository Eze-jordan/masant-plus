import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Paiement from '#models/paiement'
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
}
