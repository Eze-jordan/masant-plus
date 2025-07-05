import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
/*
|--------------------------------------------------------------------------
| Global error handler
|--------------------------------------------------------------------------
*/
server.errorHandler(() => import('#exceptions/handler'))

/*
|--------------------------------------------------------------------------
| Global server middleware - run on every HTTP request (no matter the route)
|--------------------------------------------------------------------------
*/
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/app_key_guard_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/static/static_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/vite/vite_middleware'),
  () => import('@adonisjs/inertia/inertia_middleware'),
])

/*
|--------------------------------------------------------------------------
| Global router middleware - run on every HTTP request with a registered route
|--------------------------------------------------------------------------
*/
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/session/session_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  () => import('@adonisjs/shield/shield_middleware'),
  () => import('#middleware/only_frontend_middleware'),
  () => import('#middleware/initialize_bouncer_middleware'),
])

/*
|--------------------------------------------------------------------------
| Named middleware - explicitly applied on routes or groups
|--------------------------------------------------------------------------
*/
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  authJwt: () => import('#middleware/auth_jwt_middleware'),
  onlyFrontend: () => import('#middleware/only_frontend_middleware'),
})
