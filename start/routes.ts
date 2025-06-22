import router from '@adonisjs/core/services/router'
import jwt from 'jsonwebtoken'
import { createReadStream, promises as fs } from 'fs'
import mime from 'mime-types'
import { normalize } from 'node:path'

import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
import { throttle } from '#start/limiter'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import RegisterController from '#controllers/RegisterController'
import AuthController from '#controllers/auth_controller'


// ... (tes imports restent identiques)


const authController = new AuthController()
const onlyFrontend = new OnlyFrontendMiddleware()
const appKeyGuard = new AppKeyGuard()
const registerController = new RegisterController()

// Upload route sécurisée et filtrée
router.get('/upload/*', async ({ request, response }) => {
  const filePath = request.param('*').join('/')


  const normalizedPath = normalize(filePath)
  if (/(?:^|[\\/])\.\.(?:[\\/]|$)/.test(normalizedPath)) {
    return response.badRequest('Chemin invalide.')
  }

  const absolutePath = app.makePath('public/upload', normalizedPath)
  try {
    await fs.access(absolutePath)
  } catch {
    return response.status(404).send('Fichier introuvable.')
  }

  const mimeType = mime.lookup(absolutePath) || 'application/octet-stream'
  if (mimeType !== 'application/pdf') {
    return response.status(403).send('Seuls les fichiers PDF sont autorisés.')
  }

  response.header('Content-Type', mimeType)
  response.header('Content-Disposition', `inline; filename="${normalizedPath}"`)

  const fileStream = createReadStream(absolutePath)
  return response.stream(fileStream)
})

// Endpoint racine
router.get('/', async () => {
  return {
    hello: 'Hello Worlds',
    message: "Bienvenue sur l'API de gestion des utilisateurs",
    version: '1.0.0',
  }
})

// Groupe utilisateurs (CRUD)


// Route Register avec controller dédié
router.post('/register', async (ctx) => {
  console.log('[POST /register] Début de traitement')

  // Log complet de la requête entrante
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.register(ctx)
    })
  })
})
.middleware([throttle])


router
  .post('/login', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        // Appel du contrôleur pour la logique de login
        return authController.login(ctx)
      })
    })
  })
  .middleware([throttle])



// Route get /me
router
  .get('/me', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        try {
          const token = ctx.request.cookie('token') || ctx.request.header('authorization')?.split('Bearer ')[1]
          if (!token) {
            return ctx.response.status(401).json({ error: 'Accès non autorisé', message: 'Token manquant' })
          }
          if (!process.env.JWT_SECRET) {
            throw new Error('Configuration serveur invalide')
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number }
          if (!decoded?.id) {
            return ctx.response.status(401).json({ error: 'Token invalide', message: 'Structure du token incorrecte' })
          }
          const user = await User.query().select(['id', 'email', 'username']).where('id', decoded.id).first()
          if (!user) {
            return ctx.response.status(404).json({ error: 'Utilisateur introuvable', message: 'Le compte associé au token n’existe plus' })
          }
          return ctx.response.json({ success: true, data: user })
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

// Route logout
router
  .post('/logout', async (ctx) => {
    await onlyFrontend.handle(ctx, async () => {
      await appKeyGuard.handle(ctx, async () => {
        ctx.response.clearCookie('token')
        return ctx.response.send({ message: 'Déconnexion réussie' })
      })
    })
  })
  .middleware([throttle])
