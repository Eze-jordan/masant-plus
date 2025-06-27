import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { generateJwtToken } from '../Utils/Jwt.js'
import SessionUser from '#models/session_user'
import { DateTime } from 'luxon'

export default class AuthController {
  // Connexion utilisateur

  // ✅ Connexion utilisateur
  public async login({ request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    if (!email || !password) {
      return response.status(400).send({ error: 'Email et mot de passe requis.' })
    }

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(401).send({ error: 'Email invalide.' })
    }

    const isPasswordValid = await hash.verify(user.password!, password);

    if (!isPasswordValid) {
      return response.status(401).send({ error: 'Mot de passe invalide.' })
    }

    const token = generateJwtToken({ id: user.id, email: user.email })

    await SessionUser.create({
      userId: user.id,
      token: token,
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
        email: user.email,
        username: user.username,
      },
      token,
    })
  }


  // Déconnexion
  public async logout(ctx: HttpContextContract) {
    ctx.response.clearCookie('token')
    return ctx.response.send({ message: 'Déconnexion réussie' })
  }
}
