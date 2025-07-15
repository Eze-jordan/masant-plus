// app/controllers/UsersController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import vine from '@vinejs/vine'
import { promises as fs } from 'fs'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { Status } from '../enum/enums.js'
import hash from '@adonisjs/core/services/hash'
import { changePasswordSchema } from '#validators/changePasswordValidator'

export default class UsersController {
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .select([
          'id',
          'firstName',
          'lastName',
          'email',
          'phone',
          'specialisation',
          'address',
          'profileImage',
          'accountStatus',
        ])
        .firstOrFail()

      return response.ok({
        message: 'Utilisateur trouvé avec succès',
        user,
      })
    } catch (error: any) {
      console.error(error)
      return response.status(404).json({
        message: 'Utilisateur non trouvé',
        error: error.message,
      })
    }
  }

  public async changePassword({ request, response, params }: HttpContextContract) {
    try {
      const payload = await vine.validate({
        schema: changePasswordSchema,
        data: request.only(['current_password', 'password', 'password_confirmation']),
      })
  
      const user = await User.findOrFail(params.id)
      console.log('[changePassword] User ID:', user.id)
  
      const isOldPasswordValid = await hash.verify(user.password || '', payload.current_password)
      if (!isOldPasswordValid) {
        return response.status(401).send({ message: 'Ancien mot de passe incorrect.' })
      }
  
      user.password = payload.password  // en clair, le hook s’occupe du hash
      await user.save()
  
      console.log('[changePassword] Nouveau mot de passe hashé enregistré')
  
      return response.ok({ message: 'Mot de passe mis à jour avec succès.' })
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error)
      return response.status(error.status || 500).send({
        message: 'Erreur lors du changement de mot de passe.',
        error: error.messages || error.message,
      })
    }
  }
  

  
  
    public async update({ request, response, params, inertia }: HttpContextContract) {
      const updateUserSchema = vine.object({
        firstName: vine.string().trim().maxLength(50).optional(),
        lastName: vine.string().trim().maxLength(50).optional(),
        email: vine
          .string()
          .trim()
          .email()
          .maxLength(255)
          .unique(async (db, value) => {
            const existingUser = await db
              .from('users')
              .where('email', value)
              .whereNot('id', params.id)
              .first()
            return !existingUser
          })
          .optional(),
        phone: vine.string().trim().mobile().maxLength(20).optional(),
        address: vine.string().trim().maxLength(255).optional(),
        specialisation: vine.string().trim().maxLength(100).optional(),
        about: vine.string().trim().optional(),
        accountStatus: vine.enum(Object.values(Status) as [Status, ...Status[]]).optional(),
        yearsExperience: vine.string().trim().optional(),
        availability: vine.string().trim().optional(),
        specialty: vine.string().trim().optional(),
        profileImage: vine.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        }).optional(),
      })
  
      try {
        const payload = await vine.validate({
          schema: updateUserSchema,
          data: {
            ...request.all(),
            profileImage: request.file('profileImage'),
          },
        })
  
        const user = await User.findOrFail(params.id)
        const oldStatus = user.accountStatus
  
        const uploadedProfileImage = request.file('profileImage')
        if (uploadedProfileImage?.tmpPath) {
          const fileName = `uploads/profile/${cuid()}.${uploadedProfileImage.extname}`
          const fileBuffer = await fs.readFile(uploadedProfileImage.tmpPath)
  
          await drive.use('s3').put(fileName, fileBuffer)
  
          const {
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
            AWS_REGION,
            S3_ENDPOINT,
            S3_BUCKET,
            S3_FORCE_PATH_STYLE,
          } = process.env
  
          if (
            AWS_ACCESS_KEY_ID &&
            AWS_SECRET_ACCESS_KEY &&
            AWS_REGION &&
            S3_ENDPOINT &&
            S3_BUCKET
          ) {
            const s3 = new S3Client({
              region: AWS_REGION,
              credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
              },
              endpoint: S3_ENDPOINT,
              forcePathStyle: S3_FORCE_PATH_STYLE === 'true',
            })
  
            const command = new GetObjectCommand({
              Bucket: S3_BUCKET,
              Key: fileName,
            })
  
            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 604800 })
            console.log('URL signée générée :', signedUrl)
            user.profileImage = signedUrl
          } else {
            user.profileImage = fileName
          }
        }
  
        const { profileImage, ...restPayload } = payload
        user.merge(restPayload)
  
        // Si statut devient ACTIVE : générer mot de passe + envoyer par mail
        if (
          restPayload.accountStatus &&
          restPayload.accountStatus !== oldStatus &&
          restPayload.accountStatus === Status.ACTIVE
        ) {
          try {
            if (typeof user.email === 'string' && user.email.trim() !== '') {
              const randomPassword = Math.random().toString(36).slice(-10)
              const hashedPassword = await hash.make(randomPassword)
              user.password = hashedPassword
  
              console.log('Email avec mot de passe envoyé à:', user.email)
            } else {
              console.error('Erreur : email utilisateur manquant ou invalide')
            }
          } catch (mailError) {
            console.error('Erreur envoi email d\'activation:', mailError)
          }
        }
  
        await user.save()
  
        if (request.header('X-Inertia')) {
          inertia.share({ success: 'Profil mis à jour avec succès' })
          return response.redirect().back()
        }
  
        return response.ok({
          message: 'Profil mis à jour avec succès',
          user: user.serialize(),
        })
      } catch (error: any) {
        console.error(error)
  
        if (request.header('X-Inertia')) {
          inertia.share({
            errors: error.messages || { error: error.message },
          })
          return response.redirect().back()
        }
  
        return response.status(error.status || 500).json({
          message: 'Erreur lors de la mise à jour du profil',
          error: error.messages || error.message,
        })
      }
    }
  
  

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.ok({
        message: 'Utilisateur supprimé avec succès',
      })
    } catch (error: any) {
      console.error(error)
      return response.status(500).json({
        message: "Erreur lors de la suppression de l'utilisateur",
        error: error.message,
      })
    }
  }
}
