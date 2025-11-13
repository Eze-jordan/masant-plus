import nodemailer from 'nodemailer';

export default class WelcomeMailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'solutech-one.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // ✔ SSL obligatoire avec port 465
    auth: {
      user: process.env.SMTP_EMAIL,     // noreply@solutech-one.com
      pass: process.env.SMTP_PASSWORD,  // mot de passe réel du compte
    },
    tls: {
      rejectUnauthorized: false, // ✔ utile si ton serveur SMTP n'a pas un certificat valide
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
        from: `"Support MASANTE+" <${process.env.SMTP_EMAIL}>`,
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
