// app/Services/ApprovalMailService.ts
import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.MAIL_USER || 'elieboulingui2@gmail.com'
const GMAIL_APP_PASSWORD = process.env.MAIL_PASS || 'ozdf cset gqcr ofsd' // remplace par process.env en prod

export default class ApprovalMailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
    tls: {
      // utile si le serveur d'exécution a un certificat auto-signé
      rejectUnauthorized: false,
    },
  })

  static async sendApprovalEmail(first_name: string, email: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <h2 style="color: #0d6efd;">Bonjour ${first_name},</h2>
        <p style="font-size: 16px;">Nous avons bien reçu votre demande et nous tenons à vous remercier de votre intérêt pour notre plateforme.</p>
        <p style="font-size: 16px;">Un administrateur prendra contact avec vous dans les plus brefs délais (jusqu'à 30 jours) afin de vous fournir toutes les informations nécessaires à la suite de votre inscription.</p>
        <p style="font-size: 16px;">Nous vous remercions sincèrement pour votre confiance.</p>
        <p style="margin-top: 30px; font-size: 16px;">À très bientôt,<br><strong>L'équipe Support</strong></p>
      </div>
    `

    try {
      const info = await this.transporter.sendMail({
        from: `"Support MASANTE+" <${GMAIL_USER}>`,
        to: email,
        subject: 'Votre demande est en cours de validation',
        html,
      })

      console.log('✅ Approval email sent:', info.messageId)
      return info
    } catch (err) {
      console.error('❌ Failed to send approval email:', err)
      // rejeter l'erreur pour la remonter (controller/service appelant)
      throw err
    }
  }
}
