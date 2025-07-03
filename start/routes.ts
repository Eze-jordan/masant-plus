import router from '@adonisjs/core/services/router'
import { promises as fs } from 'fs'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import { readFile } from 'node:fs/promises'
import {ListObjectsV2Command } from "@aws-sdk/client-s3";
import { join } from 'node:path'
import UsersControllerAdmin from '#controllers/users_controller'
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
import User from '#models/user'
import { verifyJwtToken } from '../app/Utils/verifytoken.js'


 const  NotificationControllers  = new  NotificationController()
const controller = new MessagesController()
const adminsuser  = new UsersControllerAdmin()
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







router.post('/login', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return authController.login(ctx)
    })
  })
}).middleware([throttle])

router.get('/paiements/solde/:userId', async (ctx) => {
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

router.get('/paiements/gains-mois/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      const controller = new PaymentsController()
      return controller.getMonthlyEarnings(ctx)  // méthode à créer dans ton controller
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



router.get('/patients/count/:userId', async (ctx) => {
  await onlyFrontend.handle(ctx, async () => {
    await appKeyGuard.handle(ctx, async () => {
      return patientsController.count(ctx)
    })
  })
}).middleware([throttle])

// Consultations count route


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






router.get('/forgot-password', async ({ inertia }) => {
  return inertia.render('auth/forgot-password') // le fichier React attendu
})
router.on('/welcome').renderInertia('home')


// routes.ts
router.get('/logins', async ({ inertia }) => {
  return inertia.render('auth/login') // => resources/js/Pages/auth/login.tsx
})

router.get('/registers', async ({ inertia }) => {
  return inertia.render('auth/register') // assure-toi que ce composant existe
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
  } catch (error:any) {
    console.error('[Dashboard] Erreur JWT :', error.message)
    return response.redirect('/login')
  }
})

router.get('/logout', async (ctx) => {
  await authController.logout(ctx) // ctx contient { request, response, ... }
  return ctx.response.redirect('/')
})

