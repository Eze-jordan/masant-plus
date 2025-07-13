// app/Services/MailService.ts
import nodemailer from 'nodemailer'

export default class MailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',       // ← Fixé ici
    port: 587,
    secure: false,                // TLS
    auth: {
      user: 'eliebouligui2@gmail.com',    // ← Ton adresse Gmail
      pass: 'ozdf cset gqcr ofsd',       // ← Ton mot de passe d'application Gmail
    },
  })

  static async sendOtpEmail(to: string, code: string) {
    const html = `
      <p>Bonjour,</p>
      <p>Voici votre code de réinitialisation :</p>
      <h2>${code}</h2>
      <p>Ce code est valable pendant 10 minutes.</p>
      <p>Si vous n’avez pas demandé ce changement, ignorez cet e-mail.</p>
    `

    return await this.transporter.sendMail({
      from: '"Support AdonisJS" <eliebouligui2@gmail.com>',
      to,
      subject: 'Votre code de réinitialisation de mot de passe',
      html,
    })
  }
}
 