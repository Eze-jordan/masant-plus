import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

  // Méthode pour récupérer tous les utilisateurs avec le statut 'pending'
  public async getUsersWithPendingStatus({ response }: HttpContextContract) {
    try {
      // Récupère tous les utilisateurs dont le statut est 'pending'
      const users = await User.query().where('account_status', 'PENDING')

      // Vérifie si des utilisateurs ont été trouvés
      if (users.length === 0) {
        return response.status(404).send({ message: 'Aucun utilisateur en attente trouvé.' })
      }

      // Retourne la liste des utilisateurs en attente
      return response.ok({ users })
      
    } catch (error) {
      // Si une erreur se produit, on la gère et retourne une réponse d'erreur
      return response.status(500).send({ error: 'Erreur lors de la récupération des utilisateurs.' })
    }
  }
}
