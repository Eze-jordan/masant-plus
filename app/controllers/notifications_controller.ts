import Notification from '#models/notification'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NotificationController {
  // Récupérer toutes les notifications de l'utilisateur
  public async index({ params, response }: HttpContextContract) {
    const userId = params.id

    if (!userId) {
      return response.status(400).json({ message: 'ID utilisateur manquant' })
    }

    try {
      const notifications = await Notification.query()
        .where('idUser', userId)
        .orderBy('createdAt', 'desc')

      if (notifications.length === 0) {
        return response.status(404).json({ message: 'Aucune notification trouvée' })
      }

      return response.status(200).json({
        userId,
        notifications,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  // Récupérer une notification spécifique par ID
  public async show({ params, response }: HttpContextContract) {
    const { id, userId } = params

    if (!id || !userId) {
      return response.status(400).json({ message: 'ID notification ou utilisateur manquant' })
    }

    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', userId)
        .first()

      if (!notification) {
        return response.status(404).json({ message: 'Notification non trouvée' })
      }

      return response.status(200).json(notification)
    } catch (error) {
      console.error('Erreur lors de la récupération de la notification:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  // Marquer une notification comme lue
  public async markAsRead({ params, response }: HttpContextContract) {
    const { id, userId } = params

    if (!id || !userId) {
      return response.status(400).json({ message: 'ID notification ou utilisateur manquant' })
    }

    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', userId)
        .first()

      if (!notification) {
        return response.status(404).json({ message: 'Notification non trouvée' })
      }

      notification.isRead = true
      await notification.save()

      return response.status(200).json({ message: 'Notification marquée comme lue' })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  // Supprimer une notification spécifique par ID
  public async destroy({ params, response }: HttpContextContract) {
    const { id, userId } = params

    if (!id || !userId) {
      return response.status(400).json({ message: 'ID notification ou utilisateur manquant' })
    }

    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', userId)
        .first()

      if (!notification) {
        return response.status(404).json({ message: 'Notification non trouvée' })
      }

      await notification.delete()
      return response.status(200).json({ message: 'Notification supprimée avec succès' })
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  // Marquer toutes les notifications comme lues
  public async markAllAsRead({ params, response }: HttpContextContract) {
    const userId = params.id

    if (!userId) {
      return response.status(400).json({ message: 'ID utilisateur manquant' })
    }

    try {
      await Notification.query()
        .where('idUser', userId)
        .where('isRead', false)
        .update({ isRead: true })

      return response.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' })
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
