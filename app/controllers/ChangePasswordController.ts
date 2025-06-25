import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export default class ChangePasswordController {
  public async forceUpdateByEmail({ request, response }: HttpContextContract) {
    const email = request.input('email')

    if (!email) {
      return response.badRequest({ message: 'Email est requis.' })
    }

    const user = await User.query().where('email', email).first()
    if (!user) {
      return response.notFound({ message: 'Utilisateur non trouvé.' })
    }

    // 1. Générer un mot de passe aléatoire
    const newPassword = crypto.randomBytes(8).toString('base64').slice(0, 10)

    // 2. Hasher et sauvegarder le nouveau mot de passe
    user.password = newPassword // ou utilise Hash.make(newPassword) si le modèle ne hash pas automatiquement
    await user.save()

    // 3. Envoyer le mot de passe par email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"Clinique" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <p>Bonjour ${user.username || ''},</p>
          <p>Votre mot de passe a été réinitialisé.</p>
          <p><strong>Nouveau mot de passe :</strong> ${newPassword}</p>
          <p>Merci de le modifier dès votre prochaine connexion.</p>
          <p>— L'équipe Clinique</p>
        `,
      })
    } catch (error) {
      console.error('Erreur envoi mail :', error)
      return response.internalServerError({ message: 'Mot de passe changé, mais échec envoi e-mail.' })
    }

    return response.ok({ message: 'Mot de passe réinitialisé et envoyé par email.' })
  }
}
