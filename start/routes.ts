import router from '@adonisjs/core/services/router'
import { promises as fs } from 'fs'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import {ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import SharesController from "#controllers/shares_controller"
import AppointmentDiscussionController from "#controllers/appointment_discussions_controller"
import OnlyFrontendMiddleware from '#middleware/only_frontend_middleware'
import PrescriptionsController from '#controllers/PrescriptionsController'
import AppKeyGuard from '#middleware/app_key_guard_middleware'
import RedvpatientsController from "#controllers/redvpatients_controller"
import pourcentage_comptes_controller from '#controllers/pourcentage_comptes_controller'
import RecoursegetsController from "#controllers/recoursegets_controller"
import UserStatusController from "#controllers/statusonlines_controller"
const medicament =new   MedicamentFrancesController()
const share = new SharesController()
const rdvdupatient =new  RedvpatientsController()
const status = new UserStatusController()
const appointmentDiscussion = new AppointmentDiscussionController()
const pdfuser  = new  RecoursegetsController()
const presction  = new  PrescriptionsController()
const userinfo  =new  pourcentage_comptes_controller()
import ResourcesController from '#controllers/resources_controller';
const resourcesController = new ResourcesController();
const DemandeController =new DemandeDocteurController()
const patientsend  =new  sendinginfopatients_controller()
const doctorSpecialty  =new  SpecialiteController()
import { throttle } from '#start/limiter'
const patients  =new  PatientController()
const patients_controller = new PatientsController()
import RegisterController from '#controllers/RegisterController'
import AuthController from '#controllers/auth_controller'
import PatientsController from '#controllers/patients_controller'
import ConsultationsController from '#controllers/consultations_controller'
import PaymentsController from '#controllers/payments_controller'
import DoctorsController from '#controllers/doctors_controller'
import swaggerSpec from './swagger.js'
const doctorAll   =  new   doctor_displays_controller()
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
import UsersControllers from '#controllers/users_controller'

import DisponibilitesController from '#controllers/disponibilities_controller'
import AppointmentController from '#controllers/appointments_controller'
import { verifyJwtToken } from '../app/Utils/verifytoken.js'
import User from '#models/user'
import Payment from '#models/paiement'
import PatientdetailsController from '#controllers/PatientdetailsController';
const Patientdetails   =  new    PatientdetailsController()
const patient   =  new    PatientController()
const specialty  =  new  specialities_controller()
const patientlistingdoctors  =  new  PatientlistingDoctorsController()
import update_users_controller from '#controllers/update_users_controller'
import live_for_users_controller from '#controllers/live_for_users_controller'
import retraits_controller from '#controllers/retraits_controller';
import PatientController from '#controllers/PatientController';
import verify_emails_controller from '#controllers/verify_emails_controller';
import DemandeDocteurController from '#controllers/DemandeDocteurController';
import doctor_displays_controller from '#controllers/doctor_displays_controller';
import specialities_controller from '#controllers/specialities_controller';
import DisponibilitesdoctorController from '#controllers/DisponibilitesdoctorController';
import sendinginfopatients_controller from '#controllers/sendinginfopatients_controller';
import SpecialiteController from '#controllers/SpecialiteController';
import MedicamentFrancesController from '#controllers/medicament_frances_controller';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PatientlistingDoctorsController from '#controllers/patientlisting_doctors_controller';
const disponibilityuser  =  new    DisponibilitesController()
const userupdate    =  new   update_users_controller()
const emailverify = new verify_emails_controller()
 const  NotificationControllers  = new  NotificationController()
const  loginadmin = new  UsersControllers()
const controller = new MessagesController()
const user  = new  UsersController()
const livecontroller    = new  live_for_users_controller()
const appointmentController = new AppointmentController()
const livesController = new LivesController()
const paymentre   = new retraits_controller()
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



router.post('/login', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.login(ctx)
    })
  })

}).middleware([throttle])

router.post('/loginpatient', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.loginPatient(ctx)
    })
  })

}).middleware([throttle])

router.get('/paiements/solde/:doctorId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getBalance(ctx)
    })
  })
}).middleware([throttle])



router.get('/medecins/:userId/specialty', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return doctorsController.getDoctorSpecialty(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiements/gains-mois/:doctorId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getMonthlyEarnings(ctx)  // méthode à créer dans ton controller
    })
  })
}).middleware([throttle])

router.get('/paiements/patient/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getPaymentsByPatient(ctx)  // méthode à créer dans ton controller
    })
  })
}).middleware([throttle])
///

router.post('/medicament', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return medicament.store(ctx)
    })
  })
}).middleware([throttle])
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

        // Construire l'URL publique (à adapter selon ta config)
        const s3BaseUrl = process.env.S3_ENDPOINT?.replace(/\/$/, '') || ''
        const bucket = process.env.S3_BUCKET || ''
        const publicUrl = `${s3BaseUrl}/${bucket}/uploads/${fileName}`

        return response.created({
          message: 'Image envoyée avec succès',
          url: publicUrl,
        })
      } catch (error) {
        console.error(error)
        return response.internalServerError({ message: "Erreur lors de l'envoi de l'image" })
      }
    })
  })
})



router.post('/upload/document', async (ctx: HttpContextContract) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const { request, response } = ctx

      // Accepter les fichiers PDF et Word, avec une limite de 5MB
      const file = request.file('File', {
        size: '5mb', // Limite la taille du fichier à 5MB
        extnames: ['pdf', 'doc', 'docx'],
      })

      // Vérifier si un fichier a été fourni
      if (!file || !file.tmpPath) {
        return response.badRequest({ message: 'Aucun fichier fourni.' })
      }

      // Validation de l'extension du fichier
      if (!['pdf', 'doc', 'docx'].includes(file.extname)) {
        return response.badRequest({ message: 'Le fichier doit être un PDF ou un document Word.' })
      }

      try {
        // Générer un nom unique pour le fichier
        const fileName = `${cuid()}.${file.extname}`

        // Lire le fichier en mémoire
        const fileBuffer = await fs.readFile(file.tmpPath)

        // Upload vers S3
        await drive.use('s3').put(`uploads/profile/${fileName}`, fileBuffer)

        // Construire l'URL publique en fonction de la configuration S3
        const s3BaseUrl = process.env.S3_ENDPOINT?.replace(/\/$/, '') || ''
        const bucket = process.env.S3_BUCKET || ''

        // URL publique du fichier téléchargé
        console.log(bucket)
        const publicUrl = `${s3BaseUrl}/masanteplus/uploads/profile/${fileName}`

        // Réponse avec l'URL du fichier
        return response.created({
          message: 'Document envoyé avec succès',
          url: publicUrl,
        })
      } catch (error) {
        // Gestion des erreurs lors du téléchargement
        console.error(error)
        return response.internalServerError({ message: "Erreur lors de l'envoi du document" })
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
        ctx.response.status(500).json({ message: "Erreur lors de la génération de l'URL." });
      }
    });
  });
});


router.get('/get-docs', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
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

        // Liste tous les fichiers dans le bucket
        const listCommand = new ListObjectsV2Command({
          Bucket: bucket,
        });

        const data = await s3.send(listCommand);

        // Filtrer les fichiers ayant l'extension .doc
        const docFiles = data.Contents?.filter(file => file.Key?.endsWith('.doc') || file.Key?.endsWith('.docx'));

        if (docFiles && docFiles.length === 0) {
          ctx.response.status(404).json({ message: 'Aucun fichier .doc trouvé.' });
          return;
        }

        // Générer des URLs signées pour chaque fichier .doc
        const signedUrls = [];
        for (let file of docFiles || []) {
          const command = new GetObjectCommand({
            Bucket: bucket,
            Key: file.Key,
          });

          const url = await getSignedUrl(s3, command, { expiresIn: 604800 }); // 7 jours
          signedUrls.push({
            fileName: file.Key,
            url,
          });
        }

        // Retourner les URLs signées
        ctx.response.status(200).json(signedUrls);
      } catch (error) {
        console.error(error);
        ctx.response.status(500).json({ message: "Erreur lors de la récupération des fichiers." });
      }
    });
  });
});



router.get('/docs', async ({ view }) => {
  return view.render('welcome')
})


// Swagger JSON (servi dynamiquement)
router.get('/docs/swagger.json', async ({ response }) => {
  response.type('application/json')
  return response.send(swaggerSpec)
})
// Endpoint racine

// Route PUT pour la mise à jour du statut de l'utilisateur
router.put('/users/:id/status', async (ctx) => {
  console.log('[PUT /users/:id/status] Début de traitement')
  console.log('[PUT /users/:id/status] Params:', JSON.stringify(ctx.request.params(), null, 2))

  // On commence par exécuter un middleware frontend pour vérifier la requête
  await onlyFrontend.handle(ctx, async () => {
    // Vérifier l'API key avant de permettre la mise à jour
    await appKeyGuard.handle(ctx, async () => {
      // Appel au contrôleur pour mettre à jour le statut
      console.log('[PUT /users/:id/status] Avant appel controller updateStatus')
      return userupdate.updateStatus(ctx)  // Méthode dans le contrôleur pour mettre à jour le statut de l'utilisateur
    })
  })
}).middleware([throttle])  // Middleware pour limiter les requêtes (précaution supplémentaire)


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

router.get('/users/:id/info', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id/info] Avant appel controller show')
      return userinfo.show(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])

router.get('/prescriptions/:patientId', async (ctx) => {
  console.log('[GET /prescriptions/:patientId] Début de traitement')
  console.log('[GET /prescriptions/:patientId] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {

    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /prescriptions/:patientId] Avant appel controller show')
      return presction.index(ctx)  // Méthode pour récupérer la prescription
    })
  })
}).middleware([throttle])

router.post('/prescriptions/:doctorId/:patientId', async (ctx) => {
  console.log('[GET /prescriptions/:patientId] Début de traitement')
  console.log('[GET /prescriptions/:patientId] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {

    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /prescriptions/:patientId] Avant appel controller show')
      return presction.store(ctx)  // Méthode pour récupérer la prescription
    })
  })
}).middleware([throttle])
//
router.delete('/users/:id', async (ctx) => {
  console.log('[GET /users/:id] Début de traitement')
  console.log('[GET /users/:id] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {

    await appKeyGuard.handle(ctx, async () => {
      console.log('[GET /users/:id] Avant appel controller show')
      return user.destroy(ctx)  // Méthode pour récupérer l'utilisateur
    })
  })
}).middleware([throttle])
// pour changer le mode passe

router.put('/users/:id/change-password', async (ctx) => {
  console.log('[PUT /users/:id/change-password] Débutz de traitement')
  console.log('[PUT /users/:id/change-password] Params:', JSON.stringify(ctx.request.params(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[PUT /users/:id/change-password] Avant appel controller changePassword')
      return user.changePassword(ctx)  // Méthode pour changer le mot de passe
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


// Route GET /disponibilites (Liste toutes les disponibilités)
router.get('/disponibilites', async (ctx) => {
  console.log('[GET /disponibilites] Début')

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.index(ctx)
    })
  })
}).middleware([throttle])

router.post('/disponibilites/:id/creneaux', async (ctx) => {
  console.log(`[GET /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.createCreneaux(ctx)
    })
  })
}).middleware([throttle])

// Route GET //disponibilites/:id/creneaux (Affiche une disponibilité spécifique par ID)
router.get('/disponibilites/:id', async (ctx) => {
  console.log(`[GET /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.getByDoctor(ctx)
    })
  })
}).middleware([throttle])

router.get('/detailsdisponibilites/:id', async (ctx) => {
  console.log(`[GET /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.show(ctx)
    })
  })
}).middleware([throttle])

// Route POST /disponibilites (Créer une nouvelle disponibilité)
router.post('/disponibilites', async (ctx) => {
  console.log('[POST /disponibilites] Début')
  console.log('[Body]', ctx.request.body())

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.store(ctx)
    })
  })
}).middleware([throttle])


router.get('/patients/:id', async (ctx) => {
  console.log(`[PUT /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsend.show(ctx)
    })
  })
}).middleware([throttle])

// Route PUT /disponibilites/:id (Met à jour une disponibilité par ID) /patients/:id'

router.put('/disponibilites/:id', async (ctx) => {
  console.log(`[PUT /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return disponibilityuser.update(ctx)
    })
  })
}).middleware([throttle])

// Route DELETE /disponibilites/:id (Supprime une disponibilité par ID)
router.delete('/disponibilites/:id', async (ctx) => {
  console.log(`[DELETE /disponibilites/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return  disponibilityuser.destroy(ctx)
    })
  })
}).middleware([throttle])


router.get('/paiements/retraits-mois/:id', async (ctx) => {
  console.log(`[GET /paiements/retraits-mois/${ctx.params.id}] Début`)

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Passage de ctx avec un type explicite
      return  paymentre.retraitsParUser({
        params: { id: ctx.params.id }, // On cast explicitement le type de `params`
        response: ctx.response
      })
    })
  })
}).middleware([throttle])


router.post('/registerdocteur', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.registerDocteur(ctx)
    })
  })
}).middleware([throttle])


router.post('/registerclient', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.registerPatient(ctx)
    })
  })
}).middleware([throttle])

router.post('/registeradmin', async (ctx) => {
  console.log('[POST /register] Début de traitement')
  console.log('[POST /register] Headers:', JSON.stringify(ctx.request.headers(), null, 2))
  console.log('[POST /register] Query Params:', JSON.stringify(ctx.request.qs(), null, 2))
  console.log('[POST /register] Body:', JSON.stringify(ctx.request.body(), null, 2))

  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log('[POST /register] Avant appel controller')
      return registerController.registerAdmin(ctx)
    })
  })
}).middleware([throttle])


// Login route
router.post('/doctorspecialty', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return doctorSpecialty.create(ctx)
    })
  })
}).middleware([throttle])



router.get('/patients/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.index(ctx)
    })
  })
}).middleware([throttle])

router.get('/patients/listing-doctors/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientlistingdoctors.getDoctorsByPatient(ctx)
    })
  })
}).middleware([throttle])

router.get('/patients/listing-resource/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientlistingdoctors.getRessourcesByPatient(ctx)
    })
  })
}).middleware([throttle])

router.get('/patients', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.index(ctx)
    })
  })
}).middleware([throttle])

router.get('/patientsuser/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patient.show(ctx)
    })
  })
}).middleware([throttle])

router.get('/patient/details/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return Patientdetails.show(ctx)
    })
  })
}).middleware([throttle])

// Patientdetails


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


router.post('/paiements/visa', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Créer une instance du contrôleur
      const paiementsController = new PaiementsController()

      // Appeler la méthode d'instance sur l'objet paiementsController
      return await paiementsController.createvisaMoneyInvoice(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiements', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      // Créer une instance du contrôleur
      const paiementsController = new PaiementsController()

      // Appeler la méthode d'instance sur l'objet paiementsController
      return await paiementsController.index(ctx)
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


router.post('/verify-email', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return emailverify.checkDoctorEmail(ctx)
    })
  })
})

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


router.get('/patient', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await patients_controller.index(ctx)
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

router.post('/share', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return await share.store(ctx)
    })
  })
})

router.get('/paiement/patient/:patientId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
        const paiementsController = new PaiementsController()

      // Appeler la méthode d'instance sur l'objet paiementsController
      return await paiementsController.getByPatient(ctx)
    })
  })
})
//paiement/patient/
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

//  Création de rendez-vous 
router.post('/appointments', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.create(ctx)
    })
  })
})

//  Rendez-vous d'un médecin (avec query params)
router.get('/appointments/doctor', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.getAppointmentsForDoctor(ctx)
    })
  })
})
//  Tous les rendez-vous (admin) 
router.get('/appointments', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.listAllAppointments(ctx)
    })
  })
})

// Rendez-vous d'un patient 
router.get('/appointments/patient/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.getAppointmentsForPatient(ctx)
    })
  })
})

router.put('/appointments/cancel/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentController.cancel(ctx)
    })
  })
})

router.get('/paiment/patient/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await patients.show(ctx)
    })
  })
})
//
router.get('/disponibilites/doctor/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await disponibilityuser.show(ctx)
    })
  })
})

router.delete('/disponibilites/doctor/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await disponibilityuser.destroy(ctx)
    })/*  */
  })
})

router.post('/logins', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await loginadmin.login(ctx)
    })
  })
})

router.post('/adminlogin', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await loginadmin.admin(ctx)
    })
  })
})

router.get('/specialities', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await specialty.getAllSpecialties(ctx)
    })
  })
})

router.get('/doctors', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await doctorAll.getDoctorInfo(ctx)
    })
  })
})

router.get('/alldoctors', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await doctorAll.index(ctx)
    })
  })
})







router.get('/logout', async (ctx) => {
  await authController.logout(ctx) // ctx contient { request, response, ... }
  return ctx.response.redirect('/')
})

router.get('/404', async ({ inertia }) => {
  return inertia.render('errors/not_found')
})

// Routes d'authentification
router.get('/auth', async ({ inertia }) => {
  return inertia.render('auth/login')
})

router.get('/register', async ({ inertia }) => {
  return inertia.render('auth/register')
})

router.get('/login', async ({ inertia }) => {
  return inertia.render('auth/login')
})

router.get('/auth/rest-password', async ({ inertia }) => {
  return inertia.render('auth/rest-password')
})

// Route fallback - doit être la dernière route

router.get('/doctor', async ({ inertia }) => {
  return inertia.render('/dashboard/docteurs')
})

// Route protégée pour afficher les docteurs en attente
router.get('/ListeDemande', async (ctx) => {
  // Cette route renvoie toutes les demandes par défaut.
  // Option: ?status=pending|approved|rejected|all
  const { request, response } = ctx

  const token = request.cookie('token')
  if (!token) return response.status(401).json({ message: 'Unauthorized' })

  try {
    const payload = verifyJwtToken(token) as { id: string; email: string }
    const currentUser = await User.find(payload.id)
    if (!currentUser) return response.status(401).json({ message: 'Utilisateur non trouvé' })

    // Déléguer à DemandeDocteurController.index qui gère le filtre status
    const controller = new DemandeDocteurController()
    return await controller.index(ctx)
  } catch (error: any) {
    console.error('[ListeDemande] Erreur :', error?.message ?? error)
    return response.status(500).json({ message: 'Erreur serveur', error: String(error) })
  }
})

router.group(() => {
  // Route pour créer un live
  router.post('/lives/create/:idDiscussion', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.createLive(ctx)
    })
  })

  // Route pour récupérer les lives d'un utilisateur
  router.get('/lives/user/:userId', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.getLivesByUser(ctx)
    })
  })

  // Route pour récupérer les utilisateurs d'un live
  router.get('/lives/:liveId/users', async (ctx) => {
    await appKeyGuard.handle(ctx, async () => {
      return livecontroller.getUsersByLive(ctx)
    })
  })
})


//route pour les demandes des docteurs
router.post('/DemandeDocteur', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await DemandeController.store(ctx)
    })
  })
})


router.post('/demandes-docteurs/reject/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new DemandeDocteurController()
      return await controller.reject(ctx)
    })
  })
}).middleware([throttle])

router.get('/demandes-docteurs', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new DemandeDocteurController()
      return await controller.index(ctx)
    })
  })
}).middleware([throttle])

// Récupérer une demande par son ID
router.get('/demandes-docteurs/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new DemandeDocteurController()
      return await controller.show(ctx)
    })
  })
}).middleware([throttle])

router.post('/demandes-docteurs/approve/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new DemandeDocteurController()
      return await controller.approve(ctx)
    })
  })
}).middleware([throttle])


router.get('/doctorDisponibilities', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controllers = new DisponibilitesdoctorController()
      return await controllers.index(ctx)
    })
  })
}).middleware([throttle])

router.get('/medicaments/:name', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      console.log(ctx)
      return medicament.index(ctx)
    })
  })
}).middleware([throttle])
// Route d'accueil avec le contrôleur home
router.on('/').renderInertia('home')




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

    // 🔵 Récupérer tous les utilisateurs
    const users = await User.all()

    // 🔵 Filtrer par rôle
    const patients = users.filter(u => u.role?.label === 'patient' )
    const doctors = users.filter(u => u.role?.label === 'doctor')

    // 🔵 Récupérer tous les paiements
    const payments = await Payment.all()

    // 🔵 Total plateforme depuis les paiements
    const montantTotalPlateforme = payments.reduce((acc, p) => acc + Number(p.montant), 0)

    // 🔵 Mapper les utilisateurs sans données sensibles
    const safeUsers = users.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    }))

    const stats = {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalUsers: users.length,
      montantTotalPlateforme,
    }

    return inertia.render('dashboard/dashboard', {
      user: {
        id: currentUser.id,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        email: currentUser.email,
        role: currentUser.role,
      },
      users: safeUsers,
      stats,
      payments, // tu peux aussi faire .map pour limiter les infos exposées
    })

  } catch (error: any) {
    console.error('[Dashboard] Erreur JWT :', error.message)
    return response.redirect('/login')
  }
})



router.get('/patient/rdv/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await  rdvdupatient.hasAppointmentToday(ctx);
    });
  });
}).middleware([throttle])// Middleware pour limiter les requêtes (précaution supplémentaire)


router.get('/statut/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await status.getStatus(ctx);
    });
  });
}).middleware([throttle])

router.put('/statut/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await status.setOffline(ctx);
    });
  });
}).middleware([throttle])

router.put('/statuts/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await status.setOnline(ctx);
    });
  });
}).middleware([throttle])
//

router.get('/resources/:userId', async (ctx) => {
  console.log(ctx.params.userId)
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await pdfuser.getRessourcesByUser(ctx);
    });
  });
}).middleware([throttle])

router.get('/resources/files/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await resourcesController.index(ctx);
    });
  });
}).middleware([throttle])

router.post('/resources/files/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
        console.log("📥 Params :", ctx);
      await resourcesController.upload(ctx);
    });
  });
}).middleware([throttle])
router.get('/appointment-discussion/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentDiscussion.getDoctorsFromConfirmedAppointments(ctx);
    });
  });
}).middleware([throttle])// partage les resouses q avec les docteurs qui m on deja ete consulte



router.get('/appointment-user/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentDiscussion.getAppointmentDates(ctx);
    });
  });
}).middleware([throttle])// getPatientDetails Middleware pour limiter les requêtes (précaution supplémentaire)

router.get('/info-user/:id', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      await appointmentDiscussion.getPatientDetails(ctx);
    });
  });
}).middleware([throttle])

// Route fallback - doit être la dernière route
router.get('/*', async ({ request, inertia, response }) => {
  const acceptsHtml = request.accepts(['html', 'json']) === 'html'

  if (acceptsHtml) {
    // Renvoie la page d’erreur Inertia (HTML)
    return inertia.render('errors/not_found', { status: 404 })
  }

  // Sinon, c’est une requête API → renvoie un JSON 404
  return response.status(404).json({ message: 'Not Found' })
})
