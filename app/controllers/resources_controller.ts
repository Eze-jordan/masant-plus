import Ressource from '#models/Ressource'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'fs/promises'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'


export default class ResourcesController {
  // Récupérer toutes les ressources d'un utilisateur via son id
 public async upload({ request, response, params }: HttpContextContract) {
    // Définir le schéma avec Vine
    const validator = vine.object({
      file: vine.file({
        size: '5mb',
        extnames: ['pdf', 'doc', 'docx', 'txt'],
      }),
      titre: vine.string(),
    })

    try {
      // Compiler le schéma pour avoir un validateur
      const validateFn = vine.compile(validator)

      // Valider les données (fichier + titre)
      const payload = await validateFn.validate({
        ...request.all(),
        file: request.file('file'),
      })

      const uploadedFile = payload.file
      const fileName = `uploads/docs/${cuid()}.${uploadedFile.extname}`
      const fileBuffer = await fs.readFile(uploadedFile.tmpPath!)

      await drive.use('s3').put(fileName, fileBuffer)

      const fileUrl = await drive.use('s3').getSignedUrl(fileName, { expiresIn: 60 * 60 * 24 * 7 })

      const ressource = new Ressource()
      ressource.userId = params.userId
      ressource.titre = payload.titre
      ressource.url = fileUrl
      await ressource.save()

      return response.ok({
        message: 'Document uploadé avec succès',
        data: {
          id: ressource.id,
          url: ressource.url,
          titre: ressource.titre,
        },
      })
    } catch (error: any) {
      console.error(error)
      return response.status(400).json({
        message: "Erreur lors de l'upload",
        error: error.messages || error.message,
      })
    }
  }
  public async index({ params, response }: HttpContextContract) {
    try {
      const userId = params.id

      if (!userId) {
        return response.badRequest({ message: "L'identifiant utilisateur est requis." })
      }

      // Récupérer toutes les ressources liées à cet utilisateur
      const ressources = await Ressource.query()
        .where('user_id', userId)
        .orderBy('created_at', 'desc')

      return response.ok({
        message: `Ressources de l'utilisateur ${userId} récupérées avec succès.`,
        data: ressources,
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources :', error)
      return response.status(500).send({
        message: 'Erreur serveur lors de la récupération des ressources.',
        error: error.message,
      })
    }
  }
}


