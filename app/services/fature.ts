import nodemailer from 'nodemailer';

export default class EmailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Utilisation du port 587 (non sécurisé)
    auth: {
      user: 'elieboulingui2@gmail.com', // Ton email d'expédition
      pass: 'ozdf cset gqcr ofsd', // Le mot de passe de l'application ou ton mot de passe
    },
  });

  // Envoi d'une facture par email
  public static async sendInvoiceEmail(email: string, bill_id: string, amount: number, description: string) {
    const mailOptions = {
      from: '"Support" <elieboulingui2@gmail.com>',
      to: email,
      subject: `Votre facture de paiement (Bill ID: ${bill_id})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2 style="color: #0d6efd; text-align: center;">Votre facture de paiement</h2>
          <p>Bonjour,</p>
          <p>Nous vous confirmons que votre paiement a été traité avec succès. Voici les détails de votre facture :</p>
          <p><strong>Montant :</strong> ${amount}€</p>
          <p><strong>Description :</strong> ${description}</p>
          <p><strong>Bill ID :</strong> ${bill_id}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://example.com/invoice/${bill_id}"
               style="background-color: #0d6efd; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Voir ma facture
            </a>
          </div>
          <p>Si vous avez des questions, n'hésitez pas à contacter notre service support.</p>
          <p style="margin-top: 20px;">Cordialement,<br>L'équipe Support</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé avec succès:', info.messageId);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Impossible d\'envoyer l\'email de la facture');
    }
  }
}
