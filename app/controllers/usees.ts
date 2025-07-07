// UsersController.ts
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ inertia }: HttpContext) {
    // Récupérer les utilisateurs depuis la base de données
    const users = await User.all()

    // Convertir chaque utilisateur en JSON (si nécessaire)
    const serializedUsers = users.map(user => user.toJSON())

    // Passer les utilisateurs sérialisés à Inertia
    return inertia.render('home', { users: serializedUsers })
  }
}
