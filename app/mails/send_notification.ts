import { BaseMail } from '@adonisjs/mail'
import mail from '@adonisjs/mail/services/main'

export default class SendoptNotification extends BaseMail {
  from = 'elieboulingui2@gmail.com'
  subject = 'Votre compte est maintenant actif'

  constructor(
    private email: string,
    private password: string
  ) {
    super()
  }

  prepare() {
    this.message
      .to(this.email)
      .from(this.from)
      .subject(this.subject)
      .html(`
        <p>Bonjour <strong>${this.email}</strong>,</p>
        <p>Votre compte a été activé avec succès.</p>
        <p>Voici votre mot de passe temporaire : <strong>${this.password}</strong></p>
        <p>Veuillez le modifier dès votre première connexion.</p>
        <p>Si vous n'êtes pas à l'origine de cette action, veuillez nous contacter immédiatement.</p>
        <p>Cordialement,<br>L'équipe Ma Santé Plus</p>
      `)
  }

  public async sendEmail() {
    try {
      const mailer = mail.use()
      await this.send(mailer)
      console.log('Email envoyé avec succès!')
    } catch (error) {
      console.error("Erreur envoi email d'activation:", error)
    }
  }
}
