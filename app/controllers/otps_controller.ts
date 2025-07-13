import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import PasswordReset from '#models/PasswordReset'
import MailService from '#services/MailService'
import User from '#models/user'

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

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

    // Supprimer les anciens codes
    await PasswordReset.query().where('user_id', user.id).delete()

    // Créer un nouveau code
    await PasswordReset.create({
      userId: user.id,
      email,
      code,
      expiresAt: DateTime.now().plus({ minutes: 10 }),
    })

    try {
      await MailService.sendOtpEmail(email, code)
    } catch (error: any) {
      console.error('Erreur envoi email :', error)
      return response.status(500).json({ error: 'Échec de l’envoi de l’email.', details: error.message })
    }

    return response.status(200).json({ success: true, message: 'Code envoyé par email.' })
  }

  /**
   * Vérifie le code OTP
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

  /**
   * Réinitialise le mot de passe
   */
  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, code, password } = request.only(['email', 'code', 'password'])
  
    if (!email || !code || !password) {
      return response.status(400).json({
        error: 'Email, code et mot de passe sont requis.',
      })
    }
  
    const now = new Date()
  
    // Vérifier que le code est encore valide
    const record = await PasswordReset.query()
      .where('email', email)
      .andWhere('code', code)
      .andWhere('expires_at', '>', now)
      .first()
  
    if (!record) {
      return response.status(400).json({
        error: 'Code invalide ou expiré.',
      })
    }
  
    // Trouver l'utilisateur
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({
        error: 'Utilisateur introuvable.',
      })
    }
  
    // Assigner le nouveau mot de passe (Adonis va le hasher automatiquement)
    user.password = password
    await user.save()
  
    // Supprimer tous les OTP de cet utilisateur
    await PasswordReset.query().where('user_id', user.id).delete()
  
    return response.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès.',
    })
  }
  
}
