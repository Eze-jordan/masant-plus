import router from '@adonisjs/core/services/router'
import { createReadStream, promises as fs } from 'fs'
import mime from 'mime-types'
import { normalize } from 'node:path'

import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
import { throttle } from '#start/limiter'
import app from '@adonisjs/core/services/app'
import RegisterController from '#controllers/RegisterController'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'
import ConsultationsController from '#controllers/consultations_controller'
import AppointmentsController from '#controllers/consultations_controller'

const patientsController = new PatientsController()
const consultationsController = new ConsultationsController()
const appointmentsController = new AppointmentsController() // <-- Instanciation

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

// Register route
router.post('/register', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.register(ctx)
    })
  })
}).middleware([throttle])

// Login route
router.post('/login', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.login(ctx)
    })
  })
}).middleware([throttle])

// Logout route
router.post('/logout', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.logout(ctx)
    })
  })
}).middleware([throttle])

// Patients count route
router.get('/patients/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.count(ctx)
    })
  })
}).middleware([throttle])

// Consultations count route
router.get('/consultations/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return consultationsController.count(ctx)
    })
  })
}).middleware([throttle])

// Appointments count route (corrigée pour utiliser appointmentsController)
router.get('/appointments/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return appointmentsController.count(ctx)
    })
  })
}).middleware([throttle])
