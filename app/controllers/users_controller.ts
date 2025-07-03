import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { generateJwtToken } from '../Utils/Jwt.js'
import SessionUser from '#models/session_user'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ request, response, logger }: HttpContextContract) {
    
    const { email, password } = request.only(['email', 'password'])


    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }
    console.log(email , password)
    const user = await User.findBy('email', email)
    console.log(user)
    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }

    const storedHash = user.password?.trim() ?? ''
    logger.info(`[AuthController] Hash stocké (trimmed) : ${storedHash}`)
    logger.info(`[AuthController] Mot de passe envoyé : ${password}`)

    try {
      const isPasswordValid = await hash.verify(storedHash, password)
      if (!isPasswordValid) {
        logger.warn(`[AuthController] Mot de passe invalide pour : ${email}`)
        return response.status(401).send({ error: 'Mot de passe invalide.' })
      }
    } catch (error:any) {
      logger.error(`[AuthController] Erreur lors de la vérification du mot de passe : ${error.message}`)
      return response.status(500).send({ error: 'Erreur interne lors de la vérification du mot de passe.' })
    }

    const token = generateJwtToken({ id: user.id, email: user.email })

    await SessionUser.create({
      userId: String(user.id),
      token,
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    response.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/',
    })

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
      },
      token,
    })
  }

  // ...login ici

  public async logout({ response, request }: HttpContextContract) {
    const token = request.cookies.token

    // Supprimer la session côté base de données
    if (token) {
      await SessionUser.query().where('token', token).delete()
    }

    // Supprimer le cookie JWT
    response.clearCookie('token')

    // Redirection ou réponse Inertia-friendly
    return response.redirect('/') // ou response.status(200).send({ message: 'Déconnecté' })
  }
}

