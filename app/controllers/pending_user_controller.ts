import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ inertia, auth }: HttpContext) {
    // Récupérer tous les docteurs avec statut "pending"
    const users = await User.query()
      .preload('role', (query) => {
        query.where('label', 'doctor')
      })
      .whereHas('role', (query) => {
        query.where('label', 'doctor')
      })
      .where('accountStatus', 'pending') // 👈 ici tu filtres par statut
      .select(
        'id',
        'firstName',
        'lastName',
        'phone',
        'email',
        'specialty',
        'registrationNumber',
        'accountStatus',
        'profileImage'
      )

    // Sérialiser les docteurs pour Vue
    const serializedUsers = users.map((user) => ({
      id: user.id,
      nom: user.firstName,
      prenom: user.lastName,
      telephone: user.phone,
      email: user.email,
      specialite: user.specialty,
      matricule: user.registrationNumber,
      statut: user.accountStatus,
      photo: user.profileImage || '/doctor1.jpg',
    }))

    // Sérialiser l'utilisateur connecté
    const authUser = auth.user
    const serializedAuthUser = authUser
      ? {
          id: authUser.id,
          nom: authUser.firstName,
          prenom: authUser.lastName,
          telephone: authUser.phone,
          email: authUser.email,
          specialite: authUser.specialty,
          matricule: authUser.registrationNumber,
          statut: authUser.accountStatus,
          photo: authUser.profileImage || '/doctor1.jpg',
        }
      : null

    // Rendu Inertia
    return inertia.render('ListeDemande', {
      user: serializedAuthUser,
      users: serializedUsers,
    })
  }
}


