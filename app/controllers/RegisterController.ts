import User from '#models/user'
import Role from '#models/role'
import vine from '@vinejs/vine'
import { promises as fs } from 'fs'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import { Status } from '../enum/enums.js'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createUserValidator } from '#validators/create_user'
import fs from 'fs/promises'
import { cuid } from '@adonisjs/core/helpers'

export default class RegisterController {
  public async register(ctx: HttpContextContract) {
    const { request, response, logger } = ctx
    const raw = request.all()
    logger.info('[RegisterController] Données brutes reçues :', raw)

    const password = raw.password || 'changeme123'
    const requestData = {
      username: raw.firstName,
      email: raw.email,
      password: password,
      first_name: raw.firstName,
      last_name: raw.lastName,
      phone: raw.phone,
      address: raw.address ?? '',
      specialisation: raw.specialty,
      years_experience: raw.experience ? parseInt(raw.experience.split('-')[0]) : 0,
      registration_number: raw.licenseNumber ?? '',
      institution_name: raw.institution ?? '',
      role: raw.role,
      about: raw.about,
      account_status: Status.PENDING,
      availability: raw.availability,
      localisation: raw.localisation,
    }

    try {
      const validatedData = await createUserValidator.validate(requestData)

      const userExists = await User.findBy('email', validatedData.email)
      if (userExists) {
        return response.status(400).send({ message: 'Un utilisateur avec cet email existe déjà.' })
      }

      // Recherche du rôle, création s'il n'existe pas
      const roleLabel = raw.role.toLowerCase()
      let selectedRole = await Role.findBy('label', roleLabel)
      if (!selectedRole) {
        selectedRole = await Role.create({ label: roleLabel })
        logger.info(`[RegisterController] Rôle '${roleLabel}' créé automatiquement.`)
      }

      // Upload de la photo de profil
      let profileImageUrl: string | undefined = undefined
      const imageFile = request.file('profileImage', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imageFile && imageFile.tmpPath) {
        const fileName = `users/${cuid()}.${imageFile.extname}`
        const buffer = await fs.readFile(imageFile.tmpPath)
        await drive.use('s3').put(fileName, buffer, {
          visibility: 'public',
        })

        const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '')
        const bucket = process.env.S3_BUCKET
        profileImageUrl = `${endpoint}/${bucket}/${fileName}`
      }

      const { role, ...sanitizedData } = validatedData

      const user = await User.create({
        ...sanitizedData,
        roleId: selectedRole.id,
        profileImage: profileImageUrl,
      })

      return response.status(201).send({
        message: 'Utilisateur créé avec succès.',
        user: user.serialize(),
      })

    } catch (error: any) {
      logger.error('[RegisterController] Erreur création utilisateur', {
        message: error.message,
        stack: error.stack,
        dataSent: requestData,
      })
      return response.status(500).send({
        message: 'Erreur création utilisateur.',
        error: error.message,
        stack: error.stack,
        dataReceived: requestData,
      })
    }
  }

  public async update(ctx: HttpContextContract) {
    const { request, response, params, inertia } = ctx

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

      const uploadedProfileImage = request.file('profileImage')
      if (uploadedProfileImage?.tmpPath) {
        const fileName = `uploads/profile/${cuid()}.${uploadedProfileImage.extname}`
        const fileBuffer = await fs.readFile(uploadedProfileImage.tmpPath)

        await drive.use('s3').put(fileName, fileBuffer)

        // Génération URL signée
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

          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 604800 }) // 7 jours
          console.log('URL signée générée :', signedUrl)

          user.profileImage = signedUrl // <- Stocke l’URL signée directement
        } else {
          // Si config S3 absente, stocke juste la clé
          user.profileImage = fileName
        }
      }

      const { profileImage, ...restPayload } = payload
      user.merge(restPayload)
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
}
