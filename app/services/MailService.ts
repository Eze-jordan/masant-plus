import nodemailer from 'nodemailer'

export default class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'solutech-one.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // ✔ SSL pour port 465
    auth: {
      user: process.env.SMTP_EMAIL,     // noreply@solutech-one.com
      pass: process.env.SMTP_PASSWORD,  // mot de passe du compte
    },
    tls: {
      rejectUnauthorized: false, // ✔ utile si certificat pas 100% valide
    },
  })

  static async sendOtpEmail(to: string, code: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Bonjour,</p>
        <p>Voici votre code de réinitialisation :</p>
        <h2 style="font-size: 28px; letter-spacing: 4px;">${code}</h2>
        <p>Ce code expire dans <strong>10 minutes</strong>.</p>
        <p style="color:#555;">Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
      </div>
    `

    return await this.transporter.sendMail({
      from: `"Support MASANTE+" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: 'Votre code OTP de réinitialisation',
      html,
    })
  }
}
