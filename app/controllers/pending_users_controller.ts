import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

  // Méthode pour récupérer tous les utilisateurs avec le statut 'pending'
  public async getUsersWithPendingStatus({ inertia }: HttpContextContract) {
    try {
      // Récupère tous les utilisateurs dont le statut est 'pending'
      const users = await User.query().where('account_status', 'PENDING')

      // Vérifie si des utilisateurs ont été trouvés
      if (users.length === 0) {
        return inertia.render('dashboard', { 
          users: [], // Si aucun utilisateur, on renvoie un tableau vide
          message: 'Aucun utilisateur en attente trouvé.' 
        })
      }

      // Retourne la liste des utilisateurs en attente
      return inertia.render('dashboard', { users, message: 'Voici les utilisateurs en attente.' })
      
    } catch (error) {
      // Si une erreur se produit, on la gère et retourne une réponse d'erreur
      console.error(error)
      return inertia.render('dashboard', { 
        users: [], 
        message: 'Erreur lors de la récupération des utilisateurs.' 
      })
    }
  }
}
