// types/auth_context.d.ts
import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    authUser?: {
      id: number
      email: string
    }
  }
}
