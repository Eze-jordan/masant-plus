import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'  // Assurez-vous d'importer correctement User et Docteur

export default class UsersController {
  public async index({ inertia, auth }: HttpContext) {
    // Récupérer tous les utilisateurs avec rôle "doctor" et statut "pending"
    const users = await User.query()
      .preload('role', (query) => {
        query.where('label', 'doctor')
      })
      .whereHas('role', (query) => {
        query.where('label', 'doctor')
      })
      .where('accountStatus', 'pending')  // Filtrer par statut "pending"
      .select(
        'id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'accountStatus',
        'profileImage'
      )

    // Sérialiser les utilisateurs récupérés
    const serializedUsers = users.map((user) => {
      // Assurer que les informations nécessaires sont présentes
      const userData: {
        id: string
        nom: string | undefined
        prenom: string | undefined
        telephone: string | undefined
        email: string | undefined
        photo: string
      } = {
        id: user.id,
        nom: user.first_name,
        prenom: user.last_name,
        telephone: user.phone,
        email: user.email,
        photo: user.profileImage || '/doctor1.jpg',
      }

      return userData
    })

    // Sérialiser l'utilisateur connecté (si nécessaire, même si on ne l'affiche pas dans cette version)
    const authUser = auth.user
    const serializedAuthUser = authUser
      ? {
          id: authUser.id,
          nom: authUser.first_name,
          prenom: authUser.last_name,
          telephone: authUser.phone,
          email: authUser.email,
          photo: authUser.profileImage || '/doctor1.jpg',
        }
      : null

    // Rendu Inertia avec les docteurs et l'utilisateur connecté (si nécessaire)
    return inertia.render('ListeDemande', {
      user: serializedAuthUser,  // Données de l'utilisateur connecté
      users: serializedUsers,  // Liste des docteurs en attente
    })
  }
}
