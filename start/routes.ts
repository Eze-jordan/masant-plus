import router from '@adonisjs/core/services/router'
import { createReadStream, promises as fs } from 'fs'
import mime from 'mime-types'
import { normalize } from 'node:path'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
const doctorsController = new DoctorsController()
import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
import { throttle } from '#start/limiter'
import app from '@adonisjs/core/services/app'
import RegisterController from '#controllers/RegisterController'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'
import ConsultationsController from '#controllers/consultations_controller'
import PaymentsController from '#controllers/payments_controller'
import DoctorsController from '#controllers/doctors_controller'
import ChangePasswordController from '#controllers/ChangePasswordController'
import swaggerSpec from './swagger.js'

const patientsController = new PatientsController()
const consultationsController = new ConsultationsController()

const authController = new AuthController()
const onlyFrontend = new OnlyFrontendMiddleware()
const appKeyGuard = new AppKeyGuard()
const registerController = new RegisterController()

// Upload route sécurisée et filtrée

/**
 * @swagger
 * /upload/{filePath}:
 *   get:
 *     tags:
 *       - Fichiers
 *     summary: Télécharger un fichier PDF sécurisé
 *     parameters:
 *       - in: path
 *         name: filePath
 *         required: true
 *         schema:
 *           type: string
 *         description: Chemin du fichier à lire (PDF uniquement)
 *     responses:
 *       200:
 *         description: Le fichier PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Format non autorisé
 *       404:
 *         description: Fichier introuvable
 */

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


/**
 * @swagger
 * /docs:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Page Swagger UI
 *     responses:
 *       200:
 *         description: HTML Swagger UI

 * /docs/swagger.json:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Spécification Swagger JSON
 *     responses:
 *       200:
 *         description: Fichier Swagger JSON
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Général
 *     summary: Point d'entrée de l'API
 *     description: Affiche un message de bienvenue avec la version de l'API.
 *     responses:
 *       200:
 *         description: Réponse de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hello:
 *                   type: string
 *                   example: Hello Worlds
 *                 message:
 *                   type: string
 *                   example: Bienvenue sur l'API de gestion des utilisateurs
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */


router.get('/docs', async ({ response }) => {
  const htmlPath = join(app.makePath('resources'), 'swagger.html')
  const html = await readFile(htmlPath, 'utf-8')
  response.type('text/html')
  return response.send(html)
})

// Swagger JSON (servi dynamiquement)
router.get('/docs/swagger.json', async ({ response }) => {
  response.type('application/json')
  return response.send(swaggerSpec)
})
// Endpoint racine
router.get('/', async () => {
  return {
    hello: 'Hello Worlds',
    message: "Bienvenue sur l'API de gestion des utilisateurs",
    version: '1.0.0',
  }
})


/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Créer un nouvel utilisateur (médecin)
 *     description: >
 *       Cette route permet de créer un utilisateur avec le rôle DOCTOR.
 *       Un email de confirmation est envoyé après la création.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "medecin@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               address:
 *                 type: string
 *                 example: "10 rue de la paix, Paris"
 *               specialty:
 *                 type: string
 *                 example: "Cardiologie"
 *               experience:
 *                 type: string
 *                 description: "Années d'expérience, format '5-10'"
 *                 example: "5-10"
 *               licenseNumber:
 *                 type: string
 *                 example: "123456789"
 *               institution:
 *                 type: string
 *                 example: "Université de Paris"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès et email envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès. Un email a été envoyé.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     email:
 *                       type: string
 *                       example: "medecin@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "Jean"
 *                     last_name:
 *                       type: string
 *                       example: "Dupont"
 *                     roleId:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: L'email est déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Un utilisateur avec cet email existe déjà.
 *       500:
 *         description: Erreur interne serveur lors de la création
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur création utilisateur.
 *                 error:
 *                   type: string
 *                 stack:
 *                   type: string
 *                 dataReceived:
 *                   type: object
 */

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
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur avec son email et son mot de passe, retourne un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Connexion réussie avec retour des données utilisateur et token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email ou mot de passe manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email et mot de passe requis."
 *       401:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email invalide."
 * 
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion utilisateur
 *     description: Supprime le cookie de session pour déconnecter l'utilisateur.
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie"
 */




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

/**
 * @swagger
 * /patients/count/{userId}:
 *   get:
 *     tags:
 *       - Patients
 *     summary: Compte le nombre de patients créés par un utilisateur donné
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur (créateur des patients)
 *     responses:
 *       200:
 *         description: Nombre total de patients trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 *       500:
 *         description: Erreur serveur lors du comptage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */


router.get('/patients/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.count(ctx)
    })
  })
}).middleware([throttle])

// Consultations count route

/**
 * @swagger
 * /consultations/{userId}:
 *   get:
 *     tags:
 *       - Consultations
 *     summary: Liste des consultations d’un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur pour lequel récupérer les consultations
 *     responses:
 *       200:
 *         description: Liste des consultations formatées avec statut dynamique
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123"
 *                   patientName:
 *                     type: string
 *                     example: "Jean Dupont"
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-06-27"
 *                   heureDebut:
 *                     type: string
 *                     example: "14:00"
 *                   heureFin:
 *                     type: string
 *                     example: "14:30"
 *                   type:
 *                     type: string
 *                     example: "Consultation générale"
 *                   etatClinique:
 *                     type: string
 *                     example: "CONFIRME"
 *                   currentStatus:
 *                     type: string
 *                     description: Statut dynamique calculé (à venir, en cours, terminé, annulé)
 *                     example: "à venir"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */

/**
 * @swagger
 * /consultations/details/{id}:
 *   get:
 *     tags:
 *       - Consultations
 *     summary: Détail d’une consultation par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rendez-vous
 *     responses:
 *       200:
 *         description: Détails de la consultation avec statut dynamique
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 patientName:
 *                   type: string
 *                   example: "Jean Dupont"
 *                 doctorName:
 *                   type: string
 *                   example: "Dr. Martin"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-06-27"
 *                 heureDebut:
 *                   type: string
 *                   example: "14:00"
 *                 heureFin:
 *                   type: string
 *                   example: "14:30"
 *                 type:
 *                   type: string
 *                   example: "Consultation spécialisée"
 *                 etatClinique:
 *                   type: string
 *                   example: "CONFIRME"
 *                 currentStatus:
 *                   type: string
 *                   description: Statut dynamique calculé (à venir, en cours, terminé, annulé)
 *                   example: "en cours"
 *       404:
 *         description: Rendez-vous introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous introuvable"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */


router.get('/consultations/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return consultationsController.list(ctx)
    })
  })
}).middleware([throttle])

// payment
/**
 * @swagger
 * /paiements/solde/{userId}:
 *   get:
 *     tags:
 *       - Paiements
 *     summary: Récupérer le solde d’un utilisateur
 *     description: Somme des montants des paiements validés (statut PAYE) pour un utilisateur donné.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Solde retourné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "abc123"
 *                 solde:
 *                   type: number
 *                   description: Somme totale des paiements validés
 *                   example: 150.75
 *       500:
 *         description: Erreur serveur lors du calcul du solde
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur serveur"
 */


router.get('/paiements/solde/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getBalance(ctx)
    })
  })
}).middleware([throttle])


/**
 * @swagger
 * /users/reset-password:
 *   put:
 *     tags:
 *       - Utilisateur
 *     summary: Réinitialisation du mot de passe via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 */


/**
 * @swagger
 * /changepassword/force-update:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Réinitialiser le mot de passe d’un utilisateur par email
 *     description: Génère un nouveau mot de passe aléatoire, le sauvegarde hashé, puis l’envoie par email à l’utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l’utilisateur à qui réinitialiser le mot de passe
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé et email envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe réinitialisé et envoyé par email.
 *       400:
 *         description: Requête invalide (email manquant)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email est requis.
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur lors de l’envoi de l’email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe changé, mais échec envoi e-mail.
 */


router.put('/users/reset-password', async (ctx) => {
  const controller = new ChangePasswordController()
  return controller.forceUpdateByEmail(ctx)
})

/**
 * @swagger
 * /doctors/{id}/profile:
 *   get:
 *     tags:
 *       - Médecins
 *     summary: Récupérer le profil complet du médecin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *     responses:
 *       200:
 *         description: Profil complet du médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: Dr Dupont
 *                 specialisation:
 *                   type: string
 *                   example: Cardiologie
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: dr.dupont@example.com
 *                 phone:
 *                   type: string
 *                   example: "+33 1 23 45 67 89"
 *                 experience:
 *                   type: integer
 *                   example: 10
 *                 address:
 *                   type: string
 *                   example: "123 rue de Paris, Paris"
 *       403:
 *         description: L'utilisateur n'est pas un médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur n'est pas un médecin
 *       404:
 *         description: Médecin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Médecin non trouvé
 *
 * /doctors/{userId}/specialty:
 *   get:
 *     tags:
 *       - Médecins
 *     summary: Récupérer uniquement la spécialisation du médecin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *     responses:
 *       200:
 *         description: Spécialisation du médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: Dr Dupont
 *                 specialisation:
 *                   type: string
 *                   example: Cardiologie
 *       403:
 *         description: L'utilisateur n'est pas un médecin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur n'est pas un médecin
 *       404:
 *         description: Médecin non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Médecin non trouvé
 */


router.get('/medecins/:userId/specialty', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return doctorsController.getDoctorSpecialty(ctx)
    })
  })
}).middleware([throttle])
