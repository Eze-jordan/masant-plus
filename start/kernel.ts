import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/*
|--------------------------------------------------------------------------
| Gestionnaire global des erreurs
|--------------------------------------------------------------------------
| Capture et gère toutes les erreurs non attrapées dans l'application.
*/
server.errorHandler(() => import('#exceptions/handler'))

/*
|--------------------------------------------------------------------------
| Middleware globaux du serveur
|--------------------------------------------------------------------------
| Appliqués à toutes les requêtes HTTP, même celles sans route.
| C’est ici qu’on applique la sécurité, CORS, parsers globaux, etc.
*/
server.use([
  () => import('#middleware/container_bindings_middleware'), // Injection de dépendances
  () => import('#middleware/app_key_guard_middleware'), // Protection par x-app-key
  () => import('#middleware/force_json_response_middleware'), // Force les réponses en JSON
  () => import('@adonisjs/cors/cors_middleware'), // Active le support CORS
])

/*
|--------------------------------------------------------------------------
| Middleware globaux des routes
|--------------------------------------------------------------------------
| Ces middleware ne sont appliqués que si une route est effectivement trouvée.
| Ils s'exécutent après les middleware serveur, et avant la logique métier.
*/
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'), // Parse JSON, multipart, etc.
  () => import('@adonisjs/auth/initialize_auth_middleware'), // Initialise le système d’auth
  () => import('#middleware/only_frontend_middleware'), // Limite aux appels frontend autorisés
])

/*
|--------------------------------------------------------------------------
| Middleware nommés
|--------------------------------------------------------------------------
| Appliqués de manière ciblée dans les routes (ex: `.middleware('authJwt')`)
*/
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'), // Auth classique d'AdonisJS
  authJwt: () => import('#middleware/auth_jwt_middleware'), // Auth via JWT custom
  onlyFrontend: () => import('#middleware/only_frontend_middleware'), // Frontend autorisé uniquement
})
