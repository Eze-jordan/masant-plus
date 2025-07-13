import nodemailer from 'nodemailer'

export default class WelcomeMailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'elieboulingui2@gmail.com',
      pass: 'ozdf cset gqcr ofsd',
    },
  })

  static async sendAccountInfo(email: string, fullName: string, password: string) {
    const html = `
      <p>Bonjour ${fullName},</p>
      <p>Votre compte a bien été créé sur notre plateforme.</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Mot de passe :</strong> ${password}</p>
      <p>Vous pouvez le changer une fois connecté.</p>
    `

    return await this.transporter.sendMail({
      from: '"Support" <elieboulingui2@gmail.com>',
      to: email,
      subject: 'Bienvenue sur notre plateforme',
      html,
    })
  }
}
