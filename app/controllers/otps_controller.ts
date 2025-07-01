import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import nodemailer from 'nodemailer'
import PasswordReset from '#models/PasswordReset'
import User from '#models/user'

// Génère un code OTP à 4 chiffres
function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configuration Nodemailer avec SMTP Gmail en mode sécurisé
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,      // port SSL
  secure: true,   // true = SSL
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  logger: true,  // logs pour debug
  debug: true,   // debug détaillé
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

    const code = generate6DigitCode()

    // Supprimer les anciens codes pour cet utilisateur
    await PasswordReset.query().where('user_id', user.id).delete()

    // Enregistrer le nouveau code avec expiration (10 minutes)
    await PasswordReset.create({
      
      userId: user.id,     
      email,
      code,
      expiresAt: DateTime.now().plus({ minutes: 10 })     })

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
    } catch (error: any) {
      console.error('Erreur envoi email :', error)
      return response.status(500).json({ error: 'Échec de l’envoi de l’email.', details: error.message })
    }

    return response.status(200).json({ success: true, message: 'Code envoyé par email.' })
  }

  /**
   * Réinitialise le mot de passe si le code est valide
   
   */

  public async verifyOtp({ request, response }: HttpContextContract) {
    const { email, code } = request.only(['email', 'code'])
  
    if (!email || !code) {
      return response.status(400).json({ error: 'Email et code requis.' })
    }
  
    const now = new Date()
  
    const otpRecord = await PasswordReset.query()
      .where('email', email)
      .andWhere('code', code)
      .andWhere('expires_at', '>', now)
      .first()
  
    if (!otpRecord) {
      return response.status(400).json({ error: 'Code invalide ou expiré.' })
    }
  
    return response.status(200).json({ success: true, message: 'Code valide.' })
  }
  
  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, code, password } = request.only(['email', 'code', 'password'])

    if (!email || !code || !password) {
      return response.status(400).json({ error: 'Email, code et mot de passe requis.' })
    }

    const now = new Date()

    // Chercher le record OTP valide (date expiration > maintenant)
    const record = await PasswordReset.query()
      .where('email', email)
      .andWhere('code', code)
      .andWhere('expires_at', '>', now)
      .first()

    if (!record) {
      return response.status(400).json({ error: 'Code invalide ou expiré.' })
    }

    const user = await User.find(record.userId)
    if (!user) {
      return response.status(404).json({ error: 'Utilisateur introuvable.' })
    }

    // Hasher et sauvegarder le nouveau mot de passe
    
    user.password = password
    await user.save()

    // Supprimer le code OTP utilisé
    await PasswordReset.query().where('user_id', user.id).delete()

    return response.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès.' })
  }
}
