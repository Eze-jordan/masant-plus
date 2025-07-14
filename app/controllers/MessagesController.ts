import Message from '#models/message'
import User from '#models/user'
import Discussion from '#models/discussion'
import Notification from '#models/notification'
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

    console.log('Create message request received:', { idDiscussion, idUserSender, idUserReceiver, roleReceiver, message })

    try {
      const sender = await User.find(idUserSender)
      console.log('Sender found:', sender)
      if (!sender) {
        console.log('Expéditeur non trouvé')
        return response.status(404).send({ message: 'Expéditeur non trouvé.' })
      }

      let discussion: Discussion | null = null

      if (idDiscussion) {
        discussion = await Discussion.find(idDiscussion)
        console.log('Discussion trouvée par idDiscussion:', discussion)
        if (!discussion) {
          console.log('Discussion non trouvée')
          return response.status(404).send({ message: 'Discussion non trouvée.' })
        }
      } else {
        const receiver = await User.find(idUserReceiver)
        console.log('Receiver found:', receiver)
        if (!receiver) {
          console.log('Destinataire non trouvé')
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

        console.log('Discussion trouvée par doctor/patient:', discussion)

        if (!discussion) {
          discussion = await Discussion.create({
            idDoctor,
            idPatient,
            dateChat: DateTime.now(),
          })
          console.log('Nouvelle discussion créée:', discussion)
        }
      }

      const newMessage = await Message.create({
        idDiscussion: discussion.id,
        idUserSender,
        idUserReceiver,
        message,
      })

      // Charger l'expéditeur et le destinataire
      await newMessage.load('sender')
      await newMessage.load('receiver')

      console.log('Nouveau message créé:', newMessage)

      // Créer la notification pour le destinataire
      const notification = await Notification.create({
        idUser: idUserReceiver,
        titre: 'Nouveau message reçu',
        description: `Vous avez reçu un nouveau message de ${sender.email || 'un utilisateur'}.`,
        isRead: false,
      })

      console.log('Notification créée:', notification)

      return response.created({
        message: 'Message envoyé avec succès.',
        data: {
          id: newMessage.id,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
          senderUsername: newMessage.sender?.first_name ?? 'Inconnu',
          receiverUsername: newMessage.receiver?.first_name ?? 'Inconnu',
          idDiscussion: newMessage.idDiscussion,
        },
      })
    } catch (error: any) {
      console.error('Erreur lors de la création du message:', error)
      return response.status(500).send({
        message: 'Erreur lors de l’envoi du message.',
        error: error.message,
      })
    }
  }

  public async getByUser({ params, response }: HttpContextContract) {
    const userId = params.userId
    console.log('getByUser called with userId:', userId)

    try {
      const discussions = await Discussion.query()
        .where('idDoctor', userId)
        .orWhere('idPatient', userId)
        .preload('doctor')
        .preload('patient')

      console.log('Discussions trouvées:', discussions)

      if (discussions.length === 0) {
        console.log('Aucune discussion trouvée pour cet utilisateur')
        return response.ok({
          message: 'Aucune discussion trouvée pour cet utilisateur.',
          data: [],
        })
      }

      const results = []

      for (const discussion of discussions) {
        const lastMessage = await Message.query()
          .where('idDiscussion', discussion.id)
          .orderBy('createdAt', 'desc')
          .first()

        console.log('Dernier message pour discussion', discussion.id, ':', lastMessage)

        if (!lastMessage) continue

        const otherUser = discussion.idDoctor === userId ? discussion.patient : discussion.doctor

        results.push({
          id: discussion.id,
          name: `${otherUser.first_name} ${otherUser.lastName}`,
          lastMessage: lastMessage.message,
          time: lastMessage.createdAt.toFormat('HH:mm'),
          unread: false,
          avatar: otherUser.profileImage || `https://ui-avatars.com/api/?name=${otherUser.first_name}+${otherUser.last_name}`,
          isOnline: false,
        })
      }

      console.log('Résultats formatés:', results)

      return response.ok({
        message: 'Discussions récupérées avec succès.',
        data: results,
      })
    } catch (error: any) {
      console.error('Erreur getByUser:', error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération des messages.',
        error: error.message,
      })
    }
  }

  /**
   * Récupérer les messages d'une discussion
   */
  public async getByDiscussion({ params, response }: HttpContextContract) {
    console.log('getByDiscussion called with params:', params);
  
    try {
      const discussionId = params.discussionId;
      console.log('Recherche messages pour discussionId:', discussionId);
  
      const messages = await Message.query()
        .where('idDiscussion', discussionId)
        .preload('sender')   // Assure que `sender` contient `id` et `username`
        .preload('receiver') // Idem pour `receiver`
        .orderBy('createdAt', 'asc');
  
      console.log(`Messages RAW pour discussionId=${discussionId}:`, JSON.stringify(messages, null, 2));
  
      const formatted = messages.map((m) => ({
        id: m.id,
        message: m.message,
        createdAt: m.createdAt,
        senderId: m.sender?.id ?? null,
        receiverId: m.receiver?.id ?? null,
        senderUsername: m.sender?.first_name ?? 'Inconnu',
        receiverUsername: m.receiver?.first_name ?? 'Inconnu',
      }));
  
      console.log(`Messages formatés pour discussionId=${discussionId}:`, formatted);
  
      return response.ok({
        message: 'Messages récupérés avec succès.',
        data: formatted,
      });
    } catch (error: any) {
      console.error('Erreur getByDiscussion:', error);
      return response.status(500).send({
        message: 'Erreur lors de la récupération des messages.',
        error: error.message,
      });
    }
  }
  

  public async update({ params, request, response }: HttpContextContract) {
    const messageId = params.id
    const { message } = request.only(['message'])

    console.log('Update message called with id:', messageId, 'and new message:', message)

    try {
      const existingMessage = await Message.find(messageId)
      console.log('Message existant:', existingMessage)
      if (!existingMessage) {
        console.log('Message non trouvé')
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

      if (message !== undefined) {
        existingMessage.message = message
        console.log('Message mis à jour:', existingMessage)
      }

      await existingMessage.save()

      return response.ok({
        message: 'Message mis à jour avec succès.',
        data: existingMessage,
      })
    } catch (error: any) {
      console.error('Erreur update message:', error)
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour du message.',
        error: error.message,
      })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    console.log('Delete message called with id:', params.id)

    try {
      const message = await Message.find(params.id)
      console.log('Message à supprimer:', message)
      if (!message) {
        console.log('Message non trouvé')
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

      await message.delete()

      console.log('Message supprimé avec succès')

      return response.ok({
        message: 'Message supprimé avec succès.',
      })
    } catch (error: any) {
      console.error('Erreur delete message:', error)
      return response.status(500).send({
        message: 'Erreur lors de la suppression du message.',
        error: error.message,
      })
    }
  }

  public async deleteAllByDiscussion({ params, response }: HttpContextContract) {
    console.log('Delete all messages by discussion called with discussionId:', params.discussionId)

    try {
      const discussionId = params.discussionId

      const messages = await Message.query().where('idDiscussion', discussionId)
      console.log('Messages à supprimer:', messages)

      if (messages.length === 0) {
        console.log('Aucun message trouvé pour cette discussion')
        return response.status(404).send({ message: 'Aucun message trouvé pour cette discussion.' })
      }

      await Message.query().where('idDiscussion', discussionId).delete()

      console.log(`Tous les messages de la discussion ${discussionId} ont été supprimés.`)

      return response.ok({
        message: `Tous les messages de la discussion ${discussionId} ont été supprimés.`,
      })
    } catch (error: any) {
      console.error('Erreur deleteAllByDiscussion:', error)
      return response.status(500).send({
        message: 'Erreur lors de la suppression des messages.',
        error: error.message,
      })
    }
  }
}
