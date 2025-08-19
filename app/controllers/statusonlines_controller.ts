import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserStatusController {
  
  // Met à jour le statut de l'utilisateur à "online"
  public async setOnline({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).json({ message: "Utilisateur non trouvé" })
      }

      user.status = 'online' // Change le statut en ligne
      await user.save()

      return response.status(200).json({ message: "Statut mis à jour à 'online'" })
    } catch (error) {
      return response.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message })
    }
  }

  // Met à jour le statut de l'utilisateur à "offline"
  public async setOffline({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).json({ message: "Utilisateur non trouvé" })
      }

      user.status = 'offline' // Change le statut hors ligne
      await user.save()

      return response.status(200).json({ message: "Statut mis à jour à 'offline'" })
    } catch (error) {
      return response.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message })
    }
  }

  // Récupère le statut d'un utilisateur spécifique
  public async getStatus({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).json({ message: "Utilisateur non trouvé" })
      }

      return response.status(200).json({ status: user.status })
    } catch (error) {
      return response.status(500).json({ message: "Erreur lors de la récupération du statut", error: error.message })
    }
  }
}
