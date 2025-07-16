import nodemailer from 'nodemailer'
import { DateTime } from 'luxon'

export default class MailService {
    private static transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'elieboulingui2@gmail.com',
            pass: 'ozdf cset gqcr ofsd', // À remplacer par des variables d'environnement
        },
    })

    static async delete(user: { first_name?: string; email?: string }) {
        const deletionDate = DateTime.now().plus({ days: 30 }).toFormat('dd/MM/yyyy')
        
        const html = `
            <p>Bonjour ${user.first_name || 'Utilisateur'},</p>
            <p>Nous vous informons que votre compte a été désactivé et sera définitivement supprimé le ${deletionDate}.</p>
            <p>Si vous souhaitez annuler cette suppression, veuillez vous connecter avant cette date.</p>
            <p>Cordialement,<br>L'équipe de support</p>
        `

        if (!user.email) {
            throw new Error('Aucune adresse email disponible pour l\'utilisateur')
        }

        return await this.transporter.sendMail({
            from: '"Support" <elieboulingui2@gmail.com>',
            to: user.email,
            subject: 'Notification de suppression de compte',
            html,
        })
    }
}