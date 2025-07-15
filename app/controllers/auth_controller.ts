import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User,{Docteur}from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { generateJwtToken } from '../Utils/Jwt.js'
import SessionUser from '#models/session_user'
import { DateTime } from 'luxon'
import { Status } from '../enum/enums.js'

export default class AuthController {
  public async login({ request, response, logger }: HttpContextContract) {
    const { email, password: rawPassword } = request.only(['email', 'password'])
    const password = rawPassword.trim()

    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }

    // Utilisation de Docteur ou User selon le type
    let user = await User.query()
      .where('email', email)
      .preload('role') // Charge le rôle si utile
      .first()

    // Si l'utilisateur n'est pas trouvé, essayer Docteur
    if (!user) {
      user = await Docteur.query()
        .where('email', email)
        .preload('role') // Charge le rôle si utile
        .first()
    }

    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }

    // Check if account is active
    if (user.accountStatus !== Status.ACTIVE) {
      return response.status(403).send({ 
        error: 'Votre compte n\'est pas actif. Veuillez contacter l\'administrateur.' 
      })
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

    // Retourner les propriétés spécifiques au type d'utilisateur (Docteur ou Patient)
    return response.ok({
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        // Assurez-vous de vérifier que l'utilisateur est un médecin

        specialty: user instanceof Docteur ? user.specialisation : undefined,
        license_number: user instanceof Docteur ? user.license_number : undefined,
        role: user.role?.label ?? 'Non défini',
        accountStatus: user.accountStatus,
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
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,

        lastName: user.last_name,

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
