import Paiement from "#models/paiement"
import { StatusPaiement } from "../enum/enums.js"

export default class PaiementsController {
  /**
   * Récupérer tous les retraits d'un utilisateur
   */
  public async retraitsParUser({ params, response }: { params: { id: string }, response: any }) {
    const { id } = params // Récupérer l'ID de l'utilisateur depuis les paramètres de la route

    try {
      // Récupérer tous les paiements ayant le statut 'RETRAIT' pour cet utilisateur
      const retraits = await Paiement
        .query()
        .where('idUser', id)
        .andWhere('statut', StatusPaiement.RETRAIT) // Utilisation de l'enum pour filtrer les retraits
        .preload('mode') // Charger les informations du mode de paiement
        .preload('appointment') // Charger les informations du rendez-vous
        .orderBy('datePaiement', 'desc') // Trier les retraits par date de paiement (descendant)

      // Vérifie si des retraits ont été trouvés
      if (retraits.length === 0) {
        return response.status(404).json({ message: 'Aucun retrait trouvé pour cet utilisateur.' })
      }

      return response.ok(retraits) // Retourner les retraits
    } catch (error) {
      // Gérer les erreurs en cas de problème avec la requête
      return response.status(500).json({ message: 'Erreur lors de la récupération des retraits', error })
    }
  }
}
