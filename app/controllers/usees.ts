// UsersController.ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ inertia }: HttpContext) {
    // Récupérer les utilisateurs dont le rôle est 'doctor' avec preload du rôle
    const users = await User.query()
      .preload('role', (query) => {
        query.where('label', 'doctor') // Filtrer pour les utilisateurs ayant le rôle 'doctor'
      })
      .whereHas('role', (query) => {
        query.where('label', 'doctor') // Filtrer pour les utilisateurs ayant le rôle 'doctor'
      })
      .select('id', 'firstName', 'lastName', 'email', 'telephone', 'specialite', 'matricule', 'statut') // Sélectionner seulement les champs nécessaires

    // Convertir chaque utilisateur en JSON (avec leur rôle)
    const serializedUsers = users.map(user => ({
      ...user.toJSON(),
      roleLabel: user.role?.label, // Ajoute le label du rôle de l'utilisateur
      nom: user.firstName,   // Mappage des champs pour correspondre à Vue
      prenom: user.lastName, // Idem pour le prénom
    }));

    // Passer les utilisateurs sérialisés à Inertia
    return inertia.render('geredocteur', { users: serializedUsers })
  }
}
