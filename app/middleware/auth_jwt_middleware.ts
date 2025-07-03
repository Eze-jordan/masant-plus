import jwt from 'jsonwebtoken'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthJwtMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return response.status(500).send({ error: 'JWT_SECRET manquant dans .env' })
    }

    const token = request.cookie('token') || request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.status(401).send({ error: 'Token manquant' })
    }

    try {
      const decoded = jwt.verify(token, secret) as { id: string; email: string }

      // Tu peux stocker l'utilisateur dans le contexte si besoin
      ctx['authUser'] = decoded

      await next()
    } catch (err) {
      return response.status(401).send({ error: 'Token invalide ou expiré' })
    }
  }
}
