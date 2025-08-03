import Live from '#models/live'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from '#models/notification' // Assuming you have a Notification model
import User from '#models/user' // Assuming you have a User model to send notifications to

export default class LivesController {

  // Créer un Live
  public async create({ request, response }: HttpContextContract) {
    try {
      const name = request.input('name')

      if (!name) {
        return response.badRequest({ message: 'Le nom du live est requis.' })
      }

      const live = new Live()
      Live.assignUuid(live)
      live.name = name

      await live.save()

      // Create a notification for the live creation
      await this.sendLiveNotification('create', live)

      return response.created({
        message: 'Live créé avec succès.',
        live,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la création du live.',
        error: error.message,
      })
    }
  }

  // Récupérer tous les lives
  public async index({ response }: HttpContextContract) {
    try {
      const lives = await Live.all()
      return response.ok({
        message: 'Liste des lives récupérée avec succès.',
        lives,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des lives.',
        error: error.message,
      })
    }
  }

  // Mettre à jour un live par ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const live = await Live.find(params.id)

      if (!live) {
        return response.status(404).send({ message: 'Live non trouvé.' })
      }

      const name = request.input('name')
      if (name) {
        live.name = name
      }

      await live.save()

      // Create a notification for the live update
      await this.sendLiveNotification('update', live)

      return response.ok({
        message: 'Live mis à jour avec succès.',
        live,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour du live.',
        error: error.message,
      })
    }
  }

  // Supprimer un live par ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const live = await Live.find(params.id)

      if (!live) {
        return response.status(404).send({ message: 'Live non trouvé.' })
      }

      await live.delete()

      // Create a notification for the live deletion
      await this.sendLiveNotification('delete', live)

      return response.ok({
        message: 'Live supprimé avec succès.',
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la suppression du live.',
        error: error.message,
      })
    }
  }

  /**
   * Function to send a notification based on live action (create, update, delete).
   */
  private async sendLiveNotification(action: string, live: Live) {
    try {
      const users = await User.all() // You can adjust this to target specific users

      const notificationMessage = {
        create: `Un nouveau live "${live.name}" a été créé.`,
        update: `Le live "${live.name}" a été mis à jour.`,
        delete: `Le live "${live.name}" a été supprimé.`,
      }

      // Create a notification entry in the database
      // Ensure 'action' is a valid key of notificationMessage to satisfy TypeScript
      const description = notificationMessage[action as keyof typeof notificationMessage]
      await Notification.create({
        titre: `${action.charAt(0).toUpperCase() + action.slice(1)} Live`,
        description,
        isRead: false,
      })

      // Send push notifications to all users
      // Fix: Ensure 'action' is a valid key of notificationMessage to satisfy TypeScript
      const message = notificationMessage[action as keyof typeof notificationMessage]
      await Promise.all(users.map(async (user) => {
        if (user.expoPushToken) {
          await this.sendPushNotification(user.expoPushToken, message)
        }
      }))
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de la notification:', error)
    }
  }

  /**
   * Send a push notification to the user via Expo.
   */
  private async sendPushNotification(expoPushToken: string, message: string) {
    try {
      const body = {
        to: expoPushToken,
        sound: 'default',
        title: 'Notification Live',
        body: message,
        data: { withSome: 'data' }, // Custom data for the app can be included here
      }

      // Send the push notification using fetch
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),  // Convert the message to a JSON string
      })

      // Check for response status
      if (!response.ok) {
        const error = await response.json()
        console.error('Erreur lors de l\'envoi de la notification:', error)
      } else {
        console.log('Push notification sent successfully')
      }
    } catch (error) {
      console.error('Erreur lors de la création de la notification push:', error)
    }
  }
}
