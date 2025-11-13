// app/Services/MailService.ts
import nodemailer from 'nodemailer'

export default class MailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail', // ← PLUS FIABLE QUE host + port
    auth: {
      user: 'elieboulingui2@gmail.com',
      pass: 'ozdf cset gqcr ofsd', // ← Ton mot de passe d’application (16 caractères)
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  static async sendOtpEmail(to: string, code: string) {
    const html = `
      <p>Bonjour,</p>
      <p>Voici votre code de réinitialisation :</p>
      <h2>${code}</h2>
      <p>Il expire dans 10 minutes.</p>
      <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
    `

    return await this.transporter.sendMail({
      from: '"Support MASANTE+" <elieboulingui2@gmail.com>',
      to,
      subject: 'Votre code OTP de réinitialisation',
      html,
    })
  }
}
