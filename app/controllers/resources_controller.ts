import Ressource from '#models/Ressource'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'fs/promises'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'


export default class ResourcesController {
  // Récupérer toutes les ressources d'un utilisateur via son id
 public async upload({ request, response, params }: HttpContextContract) {
    console.log("🔄 Début upload")
    console.log("📥 Params :", params)
    console.log("📥 Headers :", request.headers())
    console.log("📥 Body :", request.all())

    // Validation du payload (file + titre)
    const validator = vine.object({
      file: vine.file({ size: '5mb' }),  // Pas de restriction d'extension
      titre: vine.string(),
    })

    try {
      const validateFn = vine.compile(validator)
      const payload = await validateFn.validate({
        ...request.all(),
        file: request.file('file'),
      })

      const uploadedFile = payload.file
      if (!uploadedFile || !uploadedFile.tmpPath) {
        throw new Error('Fichier manquant ou invalide')
      }

      // Générer nom fichier avec cuid et extension d'origine (sinon .bin)
      const fileName = `uploads/docs/${cuid()}.${uploadedFile.extname || 'bin'}`
      const fileBuffer = await fs.readFile(uploadedFile.tmpPath)

      // Upload sur S3
      await drive.use('s3').put(fileName, fileBuffer)

      // Générer URL signée (7 jours)
      const fileUrl = await drive.use('s3').getSignedUrl(fileName, { expiresIn: '7d' })

      // Création de la ressource (avec date du jour format jj/mm/aaaa)
      const ressource = new Ressource()
      ressource.userId = params.id
      ressource.titre = payload.titre
      ressource.url = fileUrl

      // Date du jour au format jj/mm/aaaa
      const today = new Date()
      const formattedDate = [
        String(today.getDate()).padStart(2, '0'),
        String(today.getMonth() + 1).padStart(2, '0'),
        today.getFullYear()
      ].join('/')
      ressource.date = formattedDate

      await ressource.save()

      return response.status(201).json({
        message: 'Document uploadé avec succès',
        data: {
          id: ressource.id,
          url: ressource.url,
          titre: ressource.titre,
          date: ressource.date,
        },
      })
    } catch (error: any) {
      console.error('Erreur backend upload:', error)

      return response.status(400).json({
        message: "Erreur lors de l'upload",
        error: error.messages || error.message || 'Erreur inconnue',
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


