import Message from '#models/message'
import User from '#models/user'
import Discussion from '#models/discussion'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class MessagesController {
  /**
   * Créer un message (et discussion doctor/patient si non existante)
   */
  public async create({ request, response }: HttpContextContract) {
    const { idDiscussion, idUserSender, idUserReceiver, roleReceiver, message } = request.only([
      'idDiscussion',
      'idUserSender',
      'idUserReceiver',
      'roleReceiver',
      'message',
    ])

    try {
      const sender = await User.find(idUserSender)
      if (!sender) {
        return response.status(404).send({ message: 'Expéditeur non trouvé.' })
      }

      let discussion: Discussion | null = null

      if (idDiscussion) {
        discussion = await Discussion.find(idDiscussion)
        if (!discussion) {
          return response.status(404).send({ message: 'Discussion non trouvée.' })
        }
      } else {
        const receiver = await User.find(idUserReceiver)
        if (!receiver) {
          return response.status(404).send({ message: 'Destinataire non trouvé.' })
        }

        let idDoctor: string
        let idPatient: string

        if (roleReceiver === 'doctor') {
          idDoctor = idUserReceiver
          idPatient = idUserSender
        } else {
          idDoctor = idUserSender
          idPatient = idUserReceiver
        }

        discussion = await Discussion.query()
          .where('idDoctor', idDoctor)
          .andWhere('idPatient', idPatient)
          .first()

        if (!discussion) {
          discussion = await Discussion.create({
            idDoctor,
            idPatient,
            dateChat: DateTime.now(),
          })
        }
      }

      const newMessage = await Message.create({
        idDiscussion: discussion.id,
        idUserSender,
        message,
      })

      return response.created({
        message: 'Message envoyé avec succès.',
        data: newMessage,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de l’envoi du message.',
        error: error.message,
      })
    }
  }

  /**
   * Récupérer les messages d'une discussion
   */
  public async getByDiscussion({ params, response }: HttpContextContract) {
    try {
      const discussionId = params.discussionId

      const messages = await Message.query()
        .where('idDiscussion', discussionId)
        .preload('sender')
        .orderBy('createdAt', 'asc')

      return response.ok({
        message: 'Messages récupérés avec succès.',
        data: messages,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des messages.',
        error: error.message,
      })
    }
  }

  /**
   * Mettre à jour un message
   */

  public async update({  params, request, response }: HttpContextContract) {
    const messageId = params.id
    const { message } = request.only(['message'])

    try {
      const existingMessage = await Message.find(messageId)
      if (!existingMessage) {
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

      // 🔐 Vérifier les autorisations

      if (message !== undefined) {
        existingMessage.message = message
      }

      await existingMessage.save()

      return response.ok({
        message: 'Message mis à jour avec succès.',
        data: existingMessage,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour du message.',
        error: error.message,
      })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    try {
      const message = await Message.find(params.id)
      if (!message) {
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

      // 🔐 Vérifier les autorisations

      await message.delete()

      return response.ok({
        message: 'Message supprimé avec succès.',
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la suppression du message.',
        error: error.message,
      })
    }
  }

  public async deleteAllByDiscussion({ params, response }: HttpContextContract) {
    try {
      const discussionId = params.discussionId

      const messages = await Message.query().where('idDiscussion', discussionId)

      if (messages.length === 0) {
        return response.status(404).send({ message: 'Aucun message trouvé pour cette discussion.' })
      }

      // 🔐 Vérifier l'autorisation sur chaque message
     

      await Message.query().where('idDiscussion', discussionId).delete()

      return response.ok({
        message: `Tous les messages de la discussion ${discussionId} ont été supprimés.`,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la suppression des messages.',
        error: error.message,
      })
    }
  }

}
