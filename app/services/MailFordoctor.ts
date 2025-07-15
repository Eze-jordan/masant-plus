import nodemailer from 'nodemailer'

export default class MailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'elieboulingui2@gmail.com',
      pass: 'ozdf cset gqcr ofsd',  // Ideally, you should use environment variables for security
    },
  })

  // Fonction dédiée pour envoyer le mail d'approbation
  static async sendApprovalEmail(recipientEmail: string) {
    const html = `
      <p>Bonjour ${recipientEmail}</p>
      <p>Votre demande a été approuvée avec succès.</p>
      <p>Un administrateur vous contactera bientôt pour vous fournir toutes les commodités nécessaires.</p>
      <p>Merci de votre confiance.</p>
    `

    return await this.transporter.sendMail({
      from: '"Support AdonisJS" <elieboulingui2@gmail.com>',
      to: recipientEmail,  // Use the dynamic email address passed to the function
      subject: 'Votre demande a été approuvée',
      html,
    })
  }
}
