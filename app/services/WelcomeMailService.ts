import nodemailer from 'nodemailer';

export default class WelcomeMailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'solutech-one.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true', // ✔ SSL activé pour port 465
    auth: {
      user: process.env.SMTP_EMAIL,     // noreply@solutech-one.com
      pass: process.env.SMTP_PASSWORD,  // mot de passe du compte
    },
    tls: {
      rejectUnauthorized: false, // ✔ utile si certificat du serveur non standard
    },
  });

  static async sendAccountInfo(email: string, fullName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
        <h2 style="color: #0d6efd; text-align: center;">Bienvenue ${fullName} !</h2>
        <p>Bonjour ${fullName},</p>
        <p>Nous sommes ravis de vous accueillir sur notre plateforme. Votre compte a été créé avec succès.</p>
        <p>Vous pouvez dès à présent accéder à votre espace personnel et profiter de nos services.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://api-masanteplus.solutech-one.com" 
             style="background-color: #0d6efd; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Se connecter
          </a>
        </div>

        <p>Si vous avez des questions, notre équipe reste à votre disposition.</p>

        <p style="margin-top: 20px;">À bientôt,<br>L'équipe Support</p>
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
