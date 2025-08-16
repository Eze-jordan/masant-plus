import DiscussionMessagery from '#models/discussion_messagery'
import User from '#models/user'
import Discussion from '#models/discussion'
import Notification from '#models/notification'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import fs from 'fs/promises'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import Ressource from '#models/Ressource'

export default class MessagesController {
  /**
   * Créer un message (texte ou fichier)
   */
  public async create({ request, response }: HttpContextContract) {
    const {
      idDiscussion,
      idUserSender,
      idUserReceiver,
      roleReceiver,
      message,
      titre,
      date,
    } = request.only([
      'idDiscussion',
      'idUserSender',
      'idUserReceiver',
      'roleReceiver',
      'message',
      'titre',
      'date',
    ])

    const file = request.file('file', {
      size: '5mb',
      extnames: ['pdf', 'doc', 'docx'],
    })

    try {
      // 1️⃣ Vérification expéditeur
      const sender = await User.find(idUserSender)
      if (!sender) {
        return response.status(404).send({ message: 'Expéditeur non trouvé.' })
      }

      // 2️⃣ Trouver ou créer discussion
      let discussion: Discussion
      if (idDiscussion) {
        const foundDiscussion = await Discussion.find(idDiscussion)
        if (!foundDiscussion) {
          return response.status(404).send({ message: 'Discussion non trouvée.' })
        }
        discussion = foundDiscussion
      } else {
        const foundDiscussion = await this.findOrCreateDiscussion(idUserSender, idUserReceiver, roleReceiver)
        if (!foundDiscussion) {
          return response.status(400).send({ message: 'Impossible de créer la discussion.' })
        }
        discussion = foundDiscussion
      }

      // 3️⃣ Upload fichier (optionnel)
      let fileUrl: string | null = null
      let typeMessage = 'text'

      if (file && file.tmpPath) {
        const fileName = `${cuid()}.${file.extname}`
        const fileBuffer = await fs.readFile(file.tmpPath)
        await drive.use('s3').put(`uploads/documents/${fileName}`, fileBuffer)

        const s3 = new S3Client({
          region: process.env.AWS_REGION!,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
          endpoint: process.env.S3_ENDPOINT!,
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        })

        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: `uploads/documents/${fileName}`,
        })

        fileUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 * 7 })
        typeMessage = 'document'

        await Ressource.create({
          url: fileUrl,
          titre: titre ?? file.clientName ?? 'Document médical',
          date: date ?? '',
          userId: idUserSender,
        })
      }

      // 4️⃣ Création du message
      const newMessage = await DiscussionMessagery.create({
        idDiscussion: discussion.id,
        idUserSender,
        message: fileUrl ?? message,
        typeMessage,
      })

      await newMessage.load('sender')

      // 5️⃣ Notification
      await Notification.create({
        idUser: idUserReceiver,
        titre: 'Nouveau message reçu',
        description: `Vous avez reçu un ${file ? 'document' : 'message'} de ${newMessage.sender?.email ?? 'un utilisateur'} ${newMessage.sender?.last_name ?? ''}.`,
        isRead: false,
      })

      return response.created({
        message: 'Message envoyé avec succès.',
        data: {
          id: newMessage.id,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
          senderUsername: newMessage.sender?.first_name ?? 'Inconnu',
          idDiscussion: newMessage.idDiscussion,
          typeMessage: newMessage.typeMessage,
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

  /**
   * Trouver ou créer discussion avec idDoctor et idPatient dans la même ligne
   */
  private async findOrCreateDiscussion(
    idUserSender: string,
    idUserReceiver: string,
    roleReceiver: string
  ): Promise<Discussion | null> {
    const receiver = await User.find(idUserReceiver)
    if (!receiver) return null

    const [idDoctor, idPatient] =
      roleReceiver === 'doctor'
        ? [idUserReceiver, idUserSender]
        : [idUserSender, idUserReceiver]

    // Vérification discussion existante dans la même ligne
    let discussion = await Discussion.query()
      .where(q => q
        .where('idDoctor', idDoctor).andWhere('idPatient', idPatient)
      )
      .orWhere(q => q
        .where('idDoctor', idPatient).andWhere('idPatient', idDoctor)
      )
      .first()

    if (!discussion) {
      discussion = await Discussion.create({
        idDoctor,
        idPatient,
        dateChat: DateTime.now(),
      })
    }

    return discussion
  }





  public async getByUser({ params, response }: HttpContextContract) {
    const userId = params.userId

    try {
      const discussions = await Discussion.query()
        .where('idDoctor', userId)
        .orWhere('idPatient', userId)
        .preload('doctor')
        .preload('patient')

      const results = []

      for (const discussion of discussions) {
        const lastMessage = await DiscussionMessagery.query()
          .where('idDiscussion', discussion.id)
          .orderBy('createdAt', 'desc')
          .first()

        if (!lastMessage) continue

        const otherUser = discussion.idDoctor === userId ? discussion.patient : discussion.doctor

        results.push({
          id: discussion.id,
          name: `${otherUser.first_name} ${otherUser.last_name}`,
          lastMessage: lastMessage.message,
          time: lastMessage.createdAt.toFormat('HH:mm'),
          unread: false,
          avatar:
            otherUser.profileImage ||
            `https://ui-avatars.com/api/?name=${otherUser.first_name}+${otherUser.last_name}`,
          isOnline: false,
        })
      }

      return response.ok({
        message: 'Discussions récupérées avec succès.',
        data: results,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des messages.',
        error: error.message,
      })
    }
  }

  public async getByDiscussion({ params, response }: HttpContextContract) {
    try {
      const discussionId = params.discussionId

      const messages = await DiscussionMessagery.query()
        .where('idDiscussion', discussionId)
        .preload('sender')
        .orderBy('createdAt', 'asc')

      const formatted = messages.map((m) => ({
        id: m.id,
        message: m.message,
        typeMessage: m.typeMessage,
        createdAt: m.createdAt,
        senderId: m.sender?.id ?? null,
        senderUsername: m.sender?.first_name ?? 'Inconnu',
      }))

      return response.ok({
        message: 'Messages récupérés avec succès.',
        data: formatted,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des messages.',
        error: error.message,
      })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const messageId = params.id
    const { message, typeMessage } = request.only(['message', 'typeMessage'])

    try {
      const existingMessage = await DiscussionMessagery.find(messageId)
      if (!existingMessage) {
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

      if (message !== undefined) existingMessage.message = message
      if (typeMessage !== undefined) existingMessage.typeMessage = typeMessage

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
      const message = await DiscussionMessagery.find(params.id)
      if (!message) {
        return response.status(404).send({ message: 'Message non trouvé.' })
      }

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

      const messages = await DiscussionMessagery.query().where('idDiscussion', discussionId)

      if (messages.length === 0) {
        return response.status(404).send({ message: 'Aucun message trouvé pour cette discussion.' })
      }

      await DiscussionMessagery.query().where('idDiscussion', discussionId).delete()

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
