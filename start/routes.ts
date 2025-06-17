import router from '@adonisjs/core/services/router'
import hash from '@adonisjs/core/services/hash'
import { createUserValidator } from '#validators/create_user'
import { generateJwtToken } from '../app/Utils/Jwt.js'
import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
import { throttle } from '#start/limiter'
import User from '#models/user'
import jwt from 'jsonwebtoken'

const scryptHash = hash.use('scrypt')
const onlyFrontend = new OnlyFrontendMiddleware()
const appKeyGuard = new AppKeyGuard()

/*
|--------------------------------------------------------------------------
| Routes publiques
|--------------------------------------------------------------------------
*/

router.get('/', async () => {
  return {
    hello: 'Hello World',
    message: "Bienvenue sur l'API de gestion des utilisateurs",
    version: '1.0.0',
  }
})

/*
|--------------------------------------------------------------------------
| Routes protégées avec vérification Frontend + App Key + Throttle
|--------------------------------------------------------------------------
*/

router
  .post('/users', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const payload = await ctx.request.validateUsing(createUserValidator)
        const user = await User.create(payload)
        return ctx.response.ok(user)
      })
    })
  })
  .middleware([throttle])

router
  .put('/users/:id', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const payload = await ctx.request.validateUsing(createUserValidator)
        const user = await User.find(ctx.params.id)

        if (!user) {
          return ctx.response.status(404).send({ error: 'User not found' })
        }

        user.merge(payload)
        await user.save()
        return ctx.response.ok(user)
      })
    })
  })
  .middleware([throttle])

router
  .delete('/users/:id', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const user = await User.find(ctx.params.id)

        if (!user) {
          return ctx.response.status(404).send({ error: 'User not found' })
        }

        await user.delete()
        return ctx.response.ok({ message: 'User deleted successfully' })
      })
    })
  })
  .middleware([throttle])

router
  .get('/users', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const users = await User.all()
        return ctx.response.ok(users)
      })
    })
  })
  .middleware([throttle]);

router
  .post('/register', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const payload = await ctx.request.validateUsing(createUserValidator)
        const user = await User.create(payload)
        return ctx.response.ok(user)
      })
    })
  })
  .middleware([throttle])

router
  .post('/login', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        const { email, password } = ctx.request.only(['email', 'password'])

        if (!email || !password) {
          return ctx.response.status(400).send({ error: 'Email et mot de passe sont requis.' })
        }

        const user = await User.findBy('email', email)
        if (!user) {
          return ctx.response.status(401).send({ error: 'Email invalide.' })
        }

        const isPasswordValid = await scryptHash.verify(user.password, password)
        if (!isPasswordValid) {
          return ctx.response.status(401).send({ error: 'Mot de passe invalide.' })
        }

        const token = generateJwtToken({ id: user.id, email: user.email })

        ctx.response.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          domain: 'localhost',
          path: '/',
        })

        return ctx.response.ok({
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
          token,
        })
      })
    })
  })
  .middleware([throttle])

router
  .get('/me', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        try {
          const token =
            ctx.request.cookie('token') || ctx.request.header('authorization')?.split('Bearer ')[1]

          if (!token) {
            return ctx.response
              .status(401)
              .json({ error: 'Accès non autorisé', message: 'Token manquant' })
          }

          if (!process.env.JWT_SECRET) {
            throw new Error('Configuration serveur invalide')
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number }

          if (!decoded?.id) {
            return ctx.response.status(401).json({
              error: 'Token invalide',
              message: 'Structure du token incorrecte',
            })
          }

          const user = await User.query()
            .select(['id', 'email', 'fullName'])
            .where('id', decoded.id)
            .first()

          if (!user) {
            return ctx.response.status(404).json({
              error: 'Utilisateur introuvable',
              message: 'Le compte associé au token n’existe plus',
            })
          }

          return ctx.response.json({
            success: true,
            data: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
            },
          })
        } catch (error) {
          const isJwtError = error instanceof jwt.JsonWebTokenError

          return ctx.response.status(401).json({
            error: isJwtError ? 'Session expirée' : "Erreur d'authentification",
            message: isJwtError ? 'Veuillez vous reconnecter' : error.message,
            code: isJwtError ? 'TOKEN_EXPIRED' : 'AUTH_ERROR',
          })
        }
      })
    })
  })
  .middleware([throttle])

router.post('/logout', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      ctx.response.clearCookie('token')
      return ctx.response.send({ message: 'Déconnexion réussie' })
    })
  })
})
