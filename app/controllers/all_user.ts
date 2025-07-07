import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ inertia, auth }: HttpContext) {
    // Récupérer tous les docteurs
    const users = await User.query()
      .preload('role', (query) => {
        query.where('label', 'doctor')
      })
      .whereHas('role', (query) => {
        query.where('label', 'doctor')
      })
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

    // Sérialiser les docteurs dans un format que Vue comprend
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

    // Passer à Inertia
    return inertia.render('geredocteur', {
      user: serializedAuthUser,
      users: serializedUsers,
    })
  }
}
