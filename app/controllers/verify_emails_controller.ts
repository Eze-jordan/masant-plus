import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'

export default class VerifyEmailController {
  public async checkDoctorEmail({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    console.log('[VerifyEmail] Email reçu:', email)

    if (!email) {
      console.log('[VerifyEmail] Email manquant dans la requête')
      return response.status(400).json({ error: 'Email requis.' })
    }

    const user = await User.query()
      .where('email', email)
      .preload('role')
      .first()

    if (!user) {
      console.log('[VerifyEmail] Aucun utilisateur trouvé pour cet email:', email)
      return response.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' })
    }

    console.log('[VerifyEmail] Utilisateur trouvé:', user.email)
    console.log('[VerifyEmail] Rôle utilisateur:', user.role ? user.role.label : 'aucun rôle')

    if (!user.role || user.role.label !== 'doctor') {
      console.log('[VerifyEmail] Rôle non valide:', user.role ? user.role.label : 'aucun rôle')
      return response.status(403).json({ error: 'Cet utilisateur n’est pas un médecin.' })
    }

    console.log('[VerifyEmail] Vérification réussie pour:', email)
    return response.ok({ success: true, message: 'Utilisateur trouvé et rôle valide.' })
  }
}
