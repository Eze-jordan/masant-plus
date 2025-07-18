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
  static async sendApprovalEmail(first_name: string , email: string) {
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
    <h2 style="color: #0d6efd;">Bonjour ${first_name},</h2>
    <p style="font-size: 16px;">Nous avons bien reçu votre demande et nous tenons à vous remercier de votre intérêt pour notre plateforme.</p>
    <p style="font-size: 16px;">Un administrateur prendra contact avec vous dans les plus brefs délais(30Jours) afin de vous fournir toutes les informations et les commodités nécessaires à la suite de votre inscription.</p>
    <p style="font-size: 16px;">Nous vous remercions sincèrement pour votre confiance.</p>
    <p style="margin-top: 30px; font-size: 16px;">À très bientôt,<br><strong>L'équipe Support</strong></p>
  </div>
`;


    return await this.transporter.sendMail({
      from: '"Support AdonisJS" <elieboulingui2@gmail.com>',
      to: email,  // Use the dynamic email address passed to the function
      subject: 'Votre demande a été approuvée',
      html,
    })
  }
}
