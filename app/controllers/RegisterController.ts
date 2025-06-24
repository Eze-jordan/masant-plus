import User from '#models/user'
import Role from '#models/role'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createUserValidator } from '#validators/create_user'
import { Status } from '../enum/enums.js'
import nodemailer from 'nodemailer'

export default class RegisterController {
  public async register(ctx: HttpContextContract) {
    const request = ctx.request
    const raw = request.all()
    ctx.logger.info('[RegisterController] Données brutes reçues :', raw)

    // Préparer les données à valider (sans certificat)
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
      ctx.logger.info('[RegisterController] Données validées :', validatedData)

      const userExists = await User.findBy('email', validatedData.email)
      if (userExists) {
        return ctx.response.status(400).send({
          message: 'Un utilisateur avec cet email existe déjà.',
        })
      }

      const doctorRole = await Role.firstOrCreate({ label: 'DOCTOR' })
      ctx.logger.info('[RegisterController] Rôle DOCTOR ID :', doctorRole.id)

      const { role, ...sanitizedData } = validatedData
      const userData: Partial<typeof User.prototype> = {
        ...sanitizedData,
        roleId: doctorRole.id,
      }

      const user = await User.create(userData)
      ctx.logger.info('[RegisterController] Utilisateur créé :', user.id)

      // ✉️ ENVOI EMAIL APRÈS CRÉATION
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"Clinique" <${process.env.SMTP_EMAIL}>`,
        to: validatedData.email,
        subject: 'Création de votre compte Clinique',
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

      ctx.logger.info('[RegisterController] Email envoyé à :', validatedData.email)

      return ctx.response.status(201).send({
        message: 'Utilisateur créé avec succès. Un email a été envoyé.',
        user,
      })
    } catch (error: any) {
      ctx.logger.error('[RegisterController] Erreur création utilisateur', {
        message: error.message,
        stack: error.stack,
        dataSent: requestData,
      })
      return ctx.response.status(500).send({
        message: 'Erreur création utilisateur.',
        error: error.message,
        stack: error.stack,
        dataReceived: requestData,
      })
    }
  }
}
