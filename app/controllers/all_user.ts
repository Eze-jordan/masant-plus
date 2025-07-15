import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Docteur } from '#models/user'

export default class UsersController {
  public async index({ inertia, auth }: HttpContext) {
    // Récupérer tous les utilisateurs (docteurs et autres)
    const users = await User.query()
      .preload('role', (query) => {
        query.where('label', 'doctor') // Précharge le rôle 'doctor'
      })
      .whereHas('role', (query) => {
        query.where('label', 'doctor') // Filtre les utilisateurs ayant le rôle 'doctor'
      })
      .select(
        'id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'specialisation',  // Spécialité du docteur
        'license_number',  // Numéro d'inscription du docteur
        'accountStatus',
        'profileImage'
      )

    // Sérialiser les utilisateurs (docteurs uniquement ici)
    const serializedUsers = users.map((user) => {
      // Vérifier si l'utilisateur est un docteur
      const isDoctor = user.role?.label === 'doctor'

      return {
        id: user.id,
        nom: user.first_name,
        prenom: user.last_name,
        telephone: user.phone,
        email: user.email,
        specialite: isDoctor ? (user as Docteur).specialisation : undefined,  // Spécialité uniquement si docteur
        matricule: isDoctor ? (user as Docteur).license_number : undefined,  // Numéro d'inscription uniquement si docteur
        statut: user.accountStatus,
        photo: user.profileImage || '/doctor1.jpg',  // Image par défaut si non définie
      }
    })

    // Sérialiser l'utilisateur connecté
    const authUser = auth.user
    const isAuthUserDoctor = authUser?.role?.label === 'doctor'

    const serializedAuthUser = authUser
      ? {
          id: authUser.id,
          nom: authUser.first_name,
          prenom: authUser.last_name,
          telephone: authUser.phone,
          email: authUser.email,
          specialite: isAuthUserDoctor ? (authUser as Docteur).specialisation : undefined,  // Spécialité si docteur
          statut: authUser.accountStatus,
          photo: authUser.profileImage || '/doctor1.jpg',  // Photo par défaut si non définie
      }
      : null

    // Passer à Inertia
    return inertia.render('geredocteur', {
      user: serializedAuthUser,
      users: serializedUsers,
    })
  }
}
