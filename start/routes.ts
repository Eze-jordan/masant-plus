import router from '@adonisjs/core/services/router'
import { promises as fs } from 'fs'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import { readFile } from 'node:fs/promises'
import {ListObjectsV2Command } from "@aws-sdk/client-s3";
import { join } from 'node:path'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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
import swaggerSpec from './swagger.js'
import PasswordResetController from '#controllers/otps_controller'
import AccountDeletionController from '#controllers/account_deletions_controller'
import AccountManagementController from '#controllers/AccountManagementController'
import FeedbackController from '#controllers/FeedbackController'
import LikesController from '#controllers/likes_controller'
import SuggestionController from '#controllers/suggestions_controller'
import LivesController from '#controllers/lives_controller'
import MessagesController from '#controllers/MessagesController'
import PaiementsController from '#controllers/PaiementsController'
import NotificationController from '#controllers/notifications_controller'
import UsersController from '#controllers/UsersController'
import DisponibilitesController from '#controllers/disponibilities_controller'
import UsersControllerAdmin from '#controllers/users_controller'
import User from '#models/user'
import { verifyJwtToken } from '../app/Utils/verifytoken.js'

 const  NotificationControllers  = new  NotificationController()
const controller = new MessagesController()
const user  = new  UsersController()
const livesController = new LivesController()
const doctorsController = new DoctorsController()
const feedbackController = new FeedbackController()
const deletecompte  = new AccountDeletionController()
const suggestionController = new SuggestionController()
const patientsController = new PatientsController()
const consultationsController = new ConsultationsController()
const admins   = new  AccountManagementController()
const authController = new AuthController()
const likesController = new LikesController()
const onlyFrontend = new OnlyFrontendMiddleware()
const appKeyGuard = new AppKeyGuard()
const registerController = new RegisterController()
const passwordResetController = new PasswordResetController()
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


// Upload route secured and filtered


router.post('/upload/image', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const { request, response } = ctx

      const file = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })

      if (!file || !file.tmpPath) {
        return response.badRequest({ message: 'Aucun fichier fourni.' })
      }

      try {
        const fileName = `${cuid()}.${file.extname}`
        const fileBuffer = await fs.readFile(file.tmpPath)

        // Upload vers S3
        await drive.use('s3').put(`uploads/${fileName}`, fileBuffer)

        // Construire l’URL publique (à adapter selon ta config)
        const s3BaseUrl = process.env.S3_ENDPOINT?.replace(/\/$/, '') || ''
        const bucket = process.env.S3_BUCKET || ''
        const publicUrl = `${s3BaseUrl}/${bucket}/uploads/${fileName}`

        return response.created({
          message: 'Image envoyée avec succès',
          url: publicUrl,
        })
      } catch (error) {
        console.error(error)
        return response.internalServerError({ message: 'Erreur lors de l’envoi de l’image' })
      }
    })
  })
})
router.get('/get-url', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const fileName = ctx.request.qs().fileName as string | undefined;

      if (!fileName) {
        ctx.response.status(400).json({ message: 'Nom du fichier manquant.' });
        return;
      }

      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      const region = process.env.AWS_REGION;
      const endpoint = process.env.S3_ENDPOINT;
      const bucket = process.env.S3_BUCKET;
      const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === 'true';

      if (!accessKeyId || !secretAccessKey || !region || !endpoint || !bucket) {
        ctx.response.status(500).json({ message: 'Configuration AWS incomplète.' });
        return;
      }

      try {
        const s3 = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          endpoint,
          forcePathStyle,
        });

        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: fileName,  // clé complète, par ex: 'users/gxuswb2bhpr1xgppkr72l6pl.jpg'
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 604800 }) // max 7 jours

        ctx.response.status(200).json({ url });
      } catch (error) {
        console.error(error);
        ctx.response.status(500).json({ message: "Erreur lors de la génération de l’URL." });
      }
    });
  });
});



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

router.get('/users/:id', async (ctx) => {
  console.log('[GET /users/:id] Début de traitement')
  console.log('[GET /users/:id] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id] Avant appel controller show')
      return user.show(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])

// Register route
router.put('/users/:id', async (ctx) => {
  console.log('[PUT /users/:id] Début de traitement')
  console.log('[PUT /users/:id] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[PUT /users/:id] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[PUT /users/:id] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[PUT /users/:id] Avant appel controller update')
      return registerController.update(ctx)  // Ton controller update ici
    })
  })
}).middleware([throttle])


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Met à jour un utilisateur par son ID (sans modification de l'email)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               specialisation:
 *                 type: string
 *               years_experience:
 *                 type: integer
 *               registration_number:
 *                 type: string
 *               institution_name:
 *                 type: string
 *               about:
 *                 type: string
 *               account_status:
 *                 type: string
 *                 enum: [PENDING, ACTIVE, SUSPENDED]
 *               availability:
 *                 type: string
 *               localisation:
 *                 type: string
 *             example:
 *               username: johndoe
 *               first_name: John
 *               last_name: Doe
 *               phone: "+123456789"
 *               address: "123 rue de Paris"
 *               specialisation: "Cardiologie"
 *               years_experience: 5
 *               registration_number: "ABC123"
 *               institution_name: "Clinique Santé"
 *               about: "Médecin passionné."
 *               account_status: ACTIVE
 *               availability: "Disponible du lundi au vendredi"
 *               localisation: "Paris"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: L'utilisateur mis à jour
 *       400:
 *         description: Données invalides ou email non modifiable
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

// Route GET /disponibilites (Liste toutes les disponibilités)
router.get('/disponibilites', async (ctx) => {
  console.log('[GET /disponibilites] Début')
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return new DisponibilitesController().index(ctx)
    })
  })
}).middleware([throttle])

// Route GET /disponibilites/:id (Affiche une disponibilité spécifique par ID)
router.get('/disponibilites/:id', async (ctx) => {
  console.log(`[GET /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return new DisponibilitesController().show(ctx)
    })
  })
}).middleware([throttle])

// Route POST /disponibilites (Créer une nouvelle disponibilité)
router.post('/disponibilites', async (ctx) => {
  console.log('[POST /disponibilites] Début')
  console.log('[Body]', ctx.request.body())

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return new DisponibilitesController().store(ctx)
    })
  })
}).middleware([throttle])

// Route PUT /disponibilites/:id (Met à jour une disponibilité par ID)
router.put('/disponibilites/:id', async (ctx) => {
  console.log(`[PUT /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return new DisponibilitesController().update(ctx)
    })
  })
}).middleware([throttle])

// Route DELETE /disponibilites/:id (Supprime une disponibilité par ID)
router.delete('/disponibilites/:id', async (ctx) => {
  console.log(`[DELETE /disponibilites/${ctx.params.id}] Début`)
  
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return new DisponibilitesController().destroy(ctx)
    })
  })
}).middleware([throttle])


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



const bucket = process.env.S3_BUCKET;

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_ENDPOINT || !process.env.S3_BUCKET) {
  throw new Error("Variables d'environnement AWS/S3 manquantes !");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

router.get('/list-files/:prefix?', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const prefixParam = ctx.params.prefix || "";
      const prefix = prefixParam ? prefixParam + "/" : "";

      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      });

      try {
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
          ctx.response.status(404).json({ message: `Aucun fichier trouvé dans '${prefix}'` });
          return;
        }

        const files = data.Contents.map(item => item.Key);

        ctx.response.json({
          prefix,
          files,
        });
      } catch (err) {
        console.error("Erreur lors de la liste des fichiers :", err);
        ctx.response.status(500).json({ message: "Erreur interne lors de la récupération des fichiers." });
      }
    });
  });
}).middleware([throttle]);



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

router.get('/paiements/gains-mois/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getMonthlyEarnings(ctx)  // méthode à créer dans ton controller
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

/**
 * @swagger
 * /medecins/{userId}/specialty:
 *   get:
 *     tags:
 *       - Médecins
 *     summary: Récupérer la spécialisation du médecin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du médecin
 *     responses:
 *       200:
 *         description: Spécialisation récupérée avec succès
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
 *         description: Utilisateur n'est pas un médecin
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

/**
 * @swagger
 * /auth/request-reset:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Demander la réinitialisation du mot de passe
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
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       400:
 *         description: Erreur dans la requête
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Réinitialiser le mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "some-reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */

/**
 * @swagger
 * /account/delete/{userId}:
 *   post:
 *     tags:
 *       - Compte
 *     summary: Supprimer un compte utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/create:
 *   post:
 *     tags:
 *       - Administration
 *     summary: Créer un compte utilisateur (patient ou docteur)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: patient ou doctor
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 */

/**
 * @swagger
 * /admin/account/suspend/{userId}:
 *   put:
 *     tags:
 *       - Administration
 *     summary: Suspendre un compte utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à suspendre
 *     responses:
 *       200:
 *         description: Compte suspendu avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/delete/{userId}:
 *   delete:
 *     tags:
 *       - Administration
 *     summary: Supprimer un compte utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/account/{userId}:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Récupérer les détails d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /admin/accounts:
 *   get:
 *     tags:
 *       - Administration
 *     summary: Récupérer tous les utilisateurs (patients et docteurs)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     tags:
 *       - Feedbacks
 *     summary: Créer un feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Très bon service"
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Feedback créé
 */

/**
 * @swagger
 * /feedbacks/{id}:
 *   put:
 *     tags:
 *       - Feedbacks
 *     summary: Mettre à jour un feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback mis à jour
 *       404:
 *         description: Feedback non trouvé
 */

/**
 * @swagger
 * /admin/feedbacks:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: Récupérer tous les feedbacks
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 */

/**
 * @swagger
 * /admin/feedbacks/{id}:
 *   delete:
 *     tags:
 *       - Feedbacks
 *     summary: Supprimer un feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du feedback à supprimer
 *     responses:
 *       200:
 *         description: Feedback supprimé
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Créer un like
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: integer
 *               idDoctor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Like créé
 */

/**
 * @swagger
 * /likes/doctor/{idDoctor}:
 *   get:
 *     tags:
 *       - Likes
 *     summary: Récupérer les likes d'un docteur
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du docteur
 *     responses:
 *       200:
 *         description: Liste des likes du docteur
 */

/**
 * @swagger
 * /suggestions:
 *   post:
 *     tags:
 *       - Suggestions
 *     summary: Créer une suggestion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: integer
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               statut:
 *                 type: string
 *     responses:
 *       201:
 *         description: Suggestion créée
 */

/**
 * @swagger
 * /suggestions/{id}:
 *   put:
 *     tags:
 *       - Suggestions
 *     summary: Mettre à jour une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la suggestion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               statut:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestion mise à jour
 *       404:
 *         description: Suggestion non trouvée
 *   delete:
 *     tags:
 *       - Suggestions
 *     summary: Supprimer une suggestion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la suggestion
 *     responses:
 *       200:
 *         description: Suggestion supprimée
 */

/**
 * @swagger
 * /suggestions:
 *   get:
 *     tags:
 *       - Suggestions
 *     summary: Récupérer toutes les suggestions
 *     responses:
 *       200:
 *         description: Liste des suggestions
 */

/**
 * @swagger
 * /suggestions/{id}:
 *   get:
 *     tags:
 *       - Suggestions
 *     summary: Récupérer une suggestion par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la suggestion
 *     responses:
 *       200:
 *         description: Suggestion trouvée
 *       404:
 *         description: Suggestion non trouvée
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Créer un message (et discussion si besoin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idDiscussion:
 *                 type: integer
 *                 nullable: true
 *               idUserSender:
 *                 type: integer
 *               idUserReceiver:
 *                 type: integer
 *               roleReceiver:
 *                 type: string
 *                 description: 'doctor' ou 'patient'
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message créé
 */

/**
 * @swagger
 * /messages/discussion/{discussionId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Récupérer tous les messages d'une discussion
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des messages
 */

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     tags:
 *       - Messages
 *     summary: Mettre à jour un message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message mis à jour
 *       404:
 *         description: Message non trouvé
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Supprimer un message
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message supprimé
 */

/**
 * @swagger
 * /messages/discussion/{discussionId}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Supprimer tous les messages d'une discussion
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages supprimés
 */

/**
 * @swagger
 * /lives:
 *   post:
 *     tags:
 *       - Lives
 *     summary: Créer un live
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Live créé
 *   get:
 *     tags:
 *       - Lives
 *     summary: Récupérer tous les lives
 *     responses:
 *       200:
 *         description: Liste des lives
 */


/**
 * @swagger
 * /likes/doctor/{idDoctor}:
 *   delete:
 *     tags:
 *       - Likes
 *     summary: Supprimer tous les likes d'un docteur donné
 *     parameters:
 *       - in: path
 *         name: idDoctor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du docteur dont on supprime les likes
 *     responses:
 *       200:
 *         description: Tous les likes du docteur ont été supprimés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tous les likes du docteur 123 ont été supprimés.
 *       404:
 *         description: Docteur non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Docteur non trouvé.
 *       500:
 *         description: Erreur serveur lors de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la suppression des likes.
 *                 error:
 *                   type: string
 *                   example: Détail de l'erreur
 */



/**
 * @swagger
 * /lives/{id}:
 *   put:
 *     tags:
 *       - Lives
 *     summary: Mettre à jour un live existant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du live à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nouveau nom du live
 *     responses:
 *       200:
 *         description: Live mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Live mis à jour avec succès.
 *                 live:
 *                   type: object
 *       404:
 *         description: Live non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Live non trouvé.
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la mise à jour du live.
 *                 error:
 *                   type: string
 *                   example: Détail de l'erreur
 */

/**
 * @swagger
 * /lives/{id}:
 *   delete:
 *     tags:
 *       - Lives
 *     summary: Supprimer un live
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du live à supprimer
 *     responses:
 *       200:
 *         description: Live supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Live supprimé avec succès.
 *       404:
 *         description: Live non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Live non trouvé.
 *       500:
 *         description: Erreur serveur lors de la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la suppression du live.
 *                 error:
 *                   type: string
 *                   example: Détail de l'erreur
 */


router.get('/medecins/:userId/specialty', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return doctorsController.getDoctorSpecialty(ctx)
    })
  })
}).middleware([throttle])

/**
 * @swagger
 * /paiements/mobile-money:
 *   post:
 *     description: Crée une facture Mobile Money et effectue un paiement
 *     tags:
 *       - Paiements
 *     parameters:
 *       - name: amount
 *         in: body
 *         description: Montant du paiement
 *         required: true
 *         schema:
 *           type: number
 *           example: 100.5
 *       - name: payer_msisdn
 *         in: body
 *         description: Numéro de téléphone de l'utilisateur payant
 *         required: true
 *         schema:
 *           type: string
 *           example: "0772345678"
 *       - name: payer_email
 *         in: body
 *         description: Email de l'utilisateur payant
 *         required: true
 *         schema:
 *           type: string
 *           example: "user@example.com"
 *       - name: short_description
 *         in: body
 *         description: Brève description du paiement
 *         required: true
 *         schema:
 *           type: string
 *           example: "Facture de paiement"
 *       - name: external_reference
 *         in: body
 *         description: Référence externe pour la transaction
 *         required: true
 *         schema:
 *           type: string
 *           example: "REF12345"
 *       - name: description
 *         in: body
 *         description: Description détaillée du paiement
 *         required: true
 *         schema:
 *           type: string
 *           example: "Paiement pour services"
 *       - name: expiry_period
 *         in: body
 *         description: Période d'expiration pour la facture
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3600
 *       - name: payment_system_name
 *         in: body
 *         description: Nom du système de paiement
 *         required: true
 *         schema:
 *           type: string
 *           example: "Mobile Money"
 *     responses:
 *       201:
 *         description: Facture et paiement créés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Facture créée et push USSD envoyé avec succès."
 *                 bill_id:
 *                   type: string
 *                   example: "12345"
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     e_bill:
 *                       type: object
 *                       properties:
 *                         bill_id:
 *                           type: string
 *                           example: "12345"
 *       500:
 *         description: Erreur de traitement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur traitement Mobile Money."
 *                 error:
 *                   type: string
 *                   example: "Erreur réseau"
 */


router.post('/paiements/mobile-money', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Créer une instance du contrôleur
      const paiementsController = new PaiementsController()
      
      // Appeler la méthode d'instance sur l'objet paiementsController
      return await paiementsController.createMobileMoneyInvoice(ctx)
    })
  })
}).middleware([throttle])

router.post('/auth/request-reset', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.requestReset(ctx)
    })
  })
})

router.post('/auth/reset-password', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.resetPassword(ctx)
    })
  })
})
///auth/verify-otp

router.post('/auth/verify-otp', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return passwordResetController.verifyOtp(ctx)
    })
  })
})

router.post('/account/delete/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return   deletecompte.deleteAccount(ctx)
    })
  })
}).middleware([throttle])

router.get('/account/all', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllUsers(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiement/invoice-status/:billId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.checkInvoiceStatus(ctx)
    })
  })
}).middleware([throttle])


router.get('/paiement/all', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllPayments(ctx)
    })
  })
}).middleware([throttle])


// Créer un utilisateur (patient ou docteur)
router.post('/admin/account/create', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.createAccount(ctx)
    })
  })
})

// Suspendre un utilisateur
router.put('/admin/account/suspend/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.suspendAccount(ctx)
    })
  })
})

// Supprimer un utilisateur
router.delete('/admin/account/delete/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.deleteAccount(ctx)
    })
  })
})

router.get('/admin/account/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getUserDetails(ctx)
    })
  })
})

// Récupérer tous les utilisateurs (patients et docteurs)
router.get('/admin/accounts', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAllUsers(ctx)
    })
  })
})

// Récupérer les paiements Mobile Money
router.get('/paiements/mobile-money', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getMobileMoneyPayments(ctx)
    })
  })
}).middleware([throttle])


router.post('/feedbacks', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await feedbackController.create(ctx)
    })
  })
})

router.put('/feedbacks/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await feedbackController.update(ctx)
    })
  })
})


// Récupérer tous les feedbacks
router.get('/admin/feedbacks', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.getAll(ctx)
    })
  })
})

// Supprimer un feedback
router.delete('/admin/feedbacks/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await admins.delete(ctx)
    })
  })
})


router.post('/likes', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.create(ctx)
    })
  })
})


// Récupérer tous les likes pour un docteur donné
router.get('/likes/doctor/:idDoctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.getLikesForDoctor(ctx)
    })
  })
})

// Supprimer tous les likes d'un docteur


router.put('/lives/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await livesController.update(ctx)
    })
  })
})


router.delete('/lives/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await livesController.delete(ctx)
    })
  })
})



router.delete('/likes/doctor/:idDoctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await likesController.deleteLikesForDoctor(ctx)
    })
  })
})
router.post('/suggestions', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.create(ctx);
    });
  });
});

// Mettre à jour une suggestion par son ID
router.put('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.update(ctx);
    });
  });
});

// Supprimer une suggestion par son ID
router.delete('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.delete(ctx);
    });
  });
});

// Récupérer toutes les suggestions
router.get('/suggestions', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.getAll(ctx);
    });
  });
});

// Récupérer une suggestion par son ID
router.get('/suggestions/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await suggestionController.getById(ctx);
    });
  });
});




// Messages routes
router.post('/messages', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.create(ctx);
    });
  });
});

router.get('/messages/user/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.getByUser(ctx)
    })
  })
})


router.get('/messages/discussion/:discussionId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.getByDiscussion(ctx);
    });
  });
});

router.put('/messages/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.update(ctx);
    });
  });
});

router.delete('/messages/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.delete(ctx);
    });
  });
});


// Récupérer toutes les notifications de l'utilisateur authentifié

// Récupérer toutes les notifications de l'utilisateur authentifié


// Récupérer une notification spécifique par ID
router.get('/notifications/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.index(ctx)
    })
  })
})

// Marquer une notification comme lue
router.put('/notifications/:id/read', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.markAsRead(ctx);
    });
  });
});


// routes.ts

router.put('/notifications/:id/readAll', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Passer l'ID utilisateur dans les paramètres à la méthode `markAllAsRead`
      await NotificationControllers.markAllAsRead(ctx);
    });
  });
});




// Supprimer une notification spécifique par ID
router.delete('/notifications/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await NotificationControllers.destroy(ctx)
    })
  })
})
router.delete('/messages/discussion/:discussionId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await controller.deleteAllByDiscussion(ctx);
    });
  });
});

// Lives routes
router.post('/lives', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await livesController.create(ctx);
    });
  });
});

router.get('/lives', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await livesController.index(ctx);
    });
  });
});
router.on('/').renderInertia('home')
// routes.ts
router.get('/auth', async ({ inertia }) => {
  return inertia.render('auth/login') // => resources/js/Pages/auth/login.tsx
})

router.get('/register', async ({ inertia }) => {
  return inertia.render('auth/register') // assure-toi que ce composant existe
})

router.get('/login', async ({ inertia }) => {
  return inertia.render('auth/login') // correspond à resources/js/Pages/auth/login.tsx
})

router.post('/logins', [UsersControllerAdmin, 'login'] as any)  // ne pas utiliser Inertia ici



router.get('/dashboard', async ({ request, response, inertia }) => {
  const token = request.cookie('token')

  if (!token) {
    return response.redirect('/login')
  }

  try {
    const payload = verifyJwtToken(token) as { id: string; email: string }
    const currentUser = await User.find(payload.id)

    if (!currentUser) {
      return response.redirect('/login')
    }

    // Récupérer tous les utilisateurs
    const users = await User.all()

    // Mapper pour ne pas exposer d’infos sensibles
    const safeUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }))

    return inertia.render('dashboard/dashboard', {
      user: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      },
      users: safeUsers,
    })
  } catch (error) {
    console.error('[Dashboard] Erreur JWT :', error.message)
    return response.redirect('/login')
  }
})

router.get('/forgot-password', async ({ inertia }) => {
  return inertia.render('auth/forgot-password') // le fichier React attendu
})


