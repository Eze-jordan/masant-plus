import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { generateJwtToken } from '../Utils/Jwt.js'
import SessionUser from '#models/session_user'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ request, response, logger }: HttpContextContract) {
    const { email, password: rawPassword } = request.only(['email', 'password'])
    const password = rawPassword.trim()

    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }

    const user = await User.query()
      .where('email', email)
      .preload('role') // Charge le rôle si utile
      .first()

    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }

    const storedHash = user.password?.trim() ?? ''
    logger.info(`[AuthController] Hash stocké : ${storedHash}`)
    logger.info(`[AuthController] Mot de passe reçu (trimmed) : ${password}`)

    try {
      const isPasswordValid = await hash.verify(storedHash, password)
      if (!isPasswordValid) {
        logger.warn(`[AuthController] Mot de passe invalide pour : ${email}`)
        return response.status(401).send({ error: 'Mot de passe invalide.' })
      }
    } catch (error: any) {
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
        matricule: user.registrationNumber,
        role: user.role?.label ?? 'Non défini',
      },
      token,
    })
  }

  //Login du patient
  public async loginPatient({ request, response, logger }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }

    // ⛔ Tu utilisais `User.findBy` sans relation
    const user = await User.query()
      .where('email', email)
      .first()

    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }


    const storedHash = user.password?.trim() ?? ''
    logger.info(`[AuthController] Hash stocké (trimmed) : ${storedHash}`)
    logger.info(`[AuthController] Mot de passe envoyé : ${password}`)

    try {
      const isPasswordValid = await hash.verify(storedHash, password)
      if (!isPasswordValid) {
        logger.warn(`[AuthController] Mot de passe et email invalide pour : ${email}`)
        return response.status(401).send({ error: 'Mot de passe invalide.' })
      }
    } catch (error: any) {
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })

    return response.ok({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        username: user.username,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
      },
      token,
    })
  }

  public async logout({ response, request, logger }: HttpContextContract) {
    const token = request.cookie('token')

    if (token) {
      await SessionUser.query().where('token', token).delete()
      logger.info('[AuthController] Session utilisateur supprimée lors de la déconnexion.')
    }

    response.clearCookie('token')
    return response.send({ message: 'Déconnexion réussie' })
  }
}
