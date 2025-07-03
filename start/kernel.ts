import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

// --------------------------------------------------------------------------
// Gestionnaire global des erreurs
// --------------------------------------------------------------------------
server.errorHandler(() => import('#exceptions/handler'))

// --------------------------------------------------------------------------
// Middleware globaux du serveur
// --------------------------------------------------------------------------
server.use([
  () => import('#middleware/container_bindings_middleware'),
  
  () => import('#middleware/app_key_guard_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

// --------------------------------------------------------------------------
// Middleware globaux des routes
// --------------------------------------------------------------------------
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('#middleware/only_frontend_middleware'),
  () => import('#middleware/initialize_bouncer_middleware'),
])

// --------------------------------------------------------------------------
// Middleware nommés
// --------------------------------------------------------------------------
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  authJwt: () => import('#middleware/auth_jwt_middleware'),
  onlyFrontend: () => import('#middleware/only_frontend_middleware'),
})
