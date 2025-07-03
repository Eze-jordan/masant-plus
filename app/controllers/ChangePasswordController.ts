import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  public async changePassword({ request, response, logger, bouncer }: HttpContextContract) {
    const { email, oldPassword, password } = request.only(['email', 'oldPassword', 'password'])

    if (!email || !oldPassword || !password) {
      return response.status(400).send({ error: 'Email, ancien mot de passe et nouveau mot de passe requis.' })
    }

    // 🔒 Autorisation via Bouncer
    try {
      await bouncer.with('changePassword').authorize(email)
    } catch (error) {
      return response.unauthorized({ error: 'Accès non autorisé pour changer ce mot de passe.' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }

    logger.info(`[AuthController] Longueur hash stocké : ${user.password?.length}`)
    logger.info(`[AuthController] Ancien mot de passe reçu : ${oldPassword}`)

    try {
      const isPasswordValid = await hash.verify(user.password!, oldPassword)
      if (!isPasswordValid) {
        return response.status(401).send({ error: 'Ancien mot de passe invalide.' })
      }

      const hashedPassword = await hash.make(password)
      user.merge({ password: hashedPassword })
      await user.save()

      return response.ok({ message: 'Mot de passe changé avec succès.' })
    } catch (error:any) {
      logger.error(`[AuthController] Erreur lors du changement de mot de passe : ${error.message}`)
      return response.status(500).send({ error: 'Erreur interne.' })
    }
  }
}
