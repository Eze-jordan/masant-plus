import SessionUser from '#models/session_user'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { generateJwtToken } from '../Utils/Jwt.js'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ request, response, logger }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }

    // 🔄 Charger l'utilisateur avec son rôle (belongsTo)
    const user = await User.query().where('email', email).preload('role').first()

    if (!user) {
      logger.warn(`[AuthController] Email non trouvé: ${email}`)
      return response.status(401).send({ error: 'Email invalide.' })
    }

    // 🔍 Log rôle pour debug
    logger.info(`[AuthController] Utilisateur trouvé. Rôle: ${user.role?.label}`)

    // ✅ Vérifier le mot de passe
    const storedHash = user.password?.trim() ?? ''
    logger.info(`[AuthController] Tentative de connexion pour : ${email}`)

    try {
      const isPasswordValid = await hash.verify(storedHash, password)
      if (!isPasswordValid) {
        logger.warn(`[AuthController] Mot de passe invalide pour : ${email}`)
        return response.status(401).send({ error: 'Mot de passe invalide.' })
      }
    } catch (error: any) {
      logger.error(`[AuthController] Erreur de vérification du mot de passe : ${error.message}`)
      return response.status(500).send({ error: 'Erreur serveur lors de la connexion.' })
    }

    // ✅ Générer le token JWT
    const token = generateJwtToken({ id: user.id, email: user.email })

    await SessionUser.create({
      userId: String(user.id),
      token,
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    // 🍪 Définir le cookie
    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/',
    })

    // 📦 Retourner la réponse utilisateur + token
    return response.ok({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        specialty: user.specialty,
        role: user.role?.label ?? 'inconnu',
      },
      token,
    })
  }
}
