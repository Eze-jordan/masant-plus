import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import nodemailer from 'nodemailer'
import User from '#models/user'
import PasswordReset from '#models/PasswordReset'

// Génère un code OTP à 4 chiffres
function generate4DigitCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Configuration Nodemailer avec SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export default class PasswordResetController {
  /**
   * Envoie un code OTP à l'utilisateur
   */
  public async requestReset({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])

    if (!email) {
      return response.status(400).json({ error: 'Email requis.' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' })
    }

    const code = generate4DigitCode()

    // Supprimer les anciens codes pour cet utilisateur
    await PasswordReset.query().where('userId', user.id.toString()).delete()

    // Enregistrer le nouveau code (expiresAt en Date JS)
    await PasswordReset.create({
      userId: user.id.toString(),
      email,
      code,
      expiresAt: DateTime.now().plus({ minutes: 10 })
    })

    try {
      await transporter.sendMail({
        from: `"Support TonApp" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Votre code de réinitialisation de mot de passe',
        html: `
          <p>Bonjour,</p>
          <p>Voici votre code de réinitialisation :</p>
          <h2>${code}</h2>
          <p>Ce code est valable pendant 10 minutes.</p>
          <p>Si vous n’avez pas demandé ce changement, ignorez cet e-mail.</p>
        `,
      })
    } catch (error) {
      console.error('Erreur envoi email :', error)
      return response.status(500).json({ error: 'Échec de l’envoi de l’email.' })
    }

    return response.status(200).json({ message: 'Code envoyé par email.' })
  }

  /**
   * Réinitialise le mot de passe si le code est valide
   */
  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, code, password } = request.only(['email', 'code', 'password'])

    if (!email || !code || !password) {
      return response.status(400).json({ error: 'Email, code et mot de passe requis.' })
    }

    const now = new Date()
    // Chercher le record OTP valide
    const record = await PasswordReset.query()
      .where('email', email)
      .andWhere('code', code)
      .andWhere('expiresAt', '>', now)
      .first()

    if (!record) {
      return response.status(400).json({ error: 'Code invalide ou expiré.' })
    }

    const user = await User.find(record.userId)
    if (!user) {
      return response.status(404).json({ error: 'Utilisateur introuvable.' })
    }

    // Hasher et merge avant sauvegarde
    const hashedPassword = await hash.make(password)
    user.merge({ password: hashedPassword })
    await user.save()

    // Supprimer le code OTP utilisé
    await PasswordReset.query().where('userId', user.id.toString()).delete()

    return response.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' })
  }
}
