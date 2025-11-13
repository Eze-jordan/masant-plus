import nodemailer from 'nodemailer';

export default class WelcomeMailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail', // ✔ plus fiable que host/port
    auth: {
      user: 'elieboulingui2@gmail.com',
      pass: 'ozdf cset gqcr ofsd', // ✔ mot de passe d'application Google
    },
    tls: {
      rejectUnauthorized: false, // ✔ évite les erreurs SSL sur serveurs non certifiés
    },
  });

  static async sendAccountInfo(email: string, fullName: string, password: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <h2 style="color: #0d6efd;">Bienvenue ${fullName} !</h2>
        <p style="font-size: 16px;">Votre compte a été créé avec succès sur notre plateforme.</p>

        <table style="border-collapse: collapse; margin: 20px 0; width: 100%;">
          <tr>
            <td style="padding: 8px; font-weight: bold; background: #f1f1f1; width: 150px;">Email :</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background: #f1f1f1;">Mot de passe :</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #555;">
          Vous pourrez modifier votre mot de passe après votre première connexion.
        </p>

        <p style="margin-top: 30px;">À très bientôt !</p>
      </div>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: '"Support MASANTE+" <elieboulingui2@gmail.com>',
        to: email,
        subject: 'Bienvenue sur notre plateforme',
        html,
      });

      console.log('✅ Email envoyé :', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Erreur d’envoi d’email :', error);
      throw error;
    }
  }
}
