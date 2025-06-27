import Role from '#models/role'
import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientsController {
  public async count({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId

      // Récupérer l'ID du rôle 'PATIENT'
      const patientRole = await Role.findByOrFail('label', 'PATIENT')

      // Compter tous les utilisateurs créés par cet user et ayant le rôle 'PATIENT'
      const result = await User
        .query()
        .where('id_user', userId)  // Champ qui référence le créateur (à adapter si nécessaire)
        .andWhere('role_id', patientRole.id)
        .count('* as total')

      const count = result[0].$extras.total

      return response.ok({ count })
    } catch (error) {
      console.error('Erreur Patient count:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
