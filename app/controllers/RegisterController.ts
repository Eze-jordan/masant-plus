import User from '#models/user'
import Role from '#models/role'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createUserValidator } from '#validators/create_user'
import { Status } from '../enum/enums.js'
import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import drive from '@adonisjs/drive/services/main'
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
      role: 'DOCTOR',
      about: 'N/A',
      account_status: Status.PENDING,
      availability: 'N/A',
      localisation: 'N/A',
    }

    try {
      const validatedData = await createUserValidator.validate(requestData)

      const userExists = await User.findBy('email', validatedData.email)
      if (userExists) {
        return response.status(400).send({ message: 'Un utilisateur avec cet email existe déjà.' })
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
          visibility: 'public', // ✅ rendre le fichier accessible publiquement
        })

        const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '')
        const bucket = process.env.S3_BUCKET
        profileImageUrl = `${endpoint}/${bucket}/${fileName}`
      }

      const doctorRole = await Role.firstOrCreate({ label: 'DOCTOR' })
      const { role, ...sanitizedData } = validatedData

      const user = await User.create({
        ...sanitizedData,
        roleId: doctorRole.id,
        profileImage: profileImageUrl,
      })

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"masanteplus" <${process.env.SMTP_EMAIL}>`,
        to: validatedData.email,
        subject: 'Création de votre compte masanteplus',
        html: `
          <p>Bonjour ${validatedData.first_name},</p>
          <p>Votre compte a été créé avec succès.</p>
          <p>Voici vos identifiants :</p>
          <ul>
            <li><strong>Email :</strong> ${validatedData.email}</li>
            <li><strong>Mot de passe :</strong> ${password}</li>
          </ul>
          <p>Merci de changer votre mot de passe à votre première connexion.</p>
          <p>— L'équipe Clinique</p>
        `,
      })

      return response.status(201).send({
        message: 'Utilisateur créé avec succès. Un email a été envoyé.',
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

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const userId = params.id
      const user = await User.find(userId)
      if (!user) {
        return response.status(404).json({ message: 'Utilisateur non trouvé.' })
      }

      const firstName = request.input('firstName')
      const lastName = request.input('lastName')
      const email = request.input('email')
      const phone = request.input('phone')
      const address = request.input('address')
      const specialisation = request.input('specialisation')

      const imageFile = request.file('profile_image', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (imageFile && imageFile.tmpPath) {
        const fileName = `users/${cuid()}.${imageFile.extname}`
        const buffer = await fs.readFile(imageFile.tmpPath)
        await drive.use('s3').put(fileName, buffer, {
          visibility: 'public', // ✅ rendre l’image modifiée accessible
        })

        const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, '')
        const bucket = process.env.S3_BUCKET
        user.profileImage = `${endpoint}/${bucket}/${fileName}`
      }

      user.merge({
        firstName,
        lastName,
        email,
        phone,
        address,
        specialisation,
      })

      await user.save()

      return response.ok({
        message: 'Utilisateur mis à jour avec succès.',
        user,
      })
    } catch (error:any) {
      return response.status(400).json({
        message: 'Erreur lors de la mise à jour de l’utilisateur.',
        error: error.messages ?? error.message,
      })
    }
  }
}
