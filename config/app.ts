import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'
import 'reflect-metadata'

export const appKey = new Secret(env.get('APP_KEY'))

export const providers = [
  '@adonisjs/core',  // The core of AdonisJS
  '@adonisjs/cors',  // CORS middleware
  '@adonisjs/session',  // Session provider if you're using sessions
  '@adonisjs/auth',  // Auth provider for user authentication
]

export const http = defineConfig({
  generateRequestId: true,
  allowMethodSpoofing: false, // You may want to set this to true for more flexible HTTP request handling
  useAsyncLocalStorage: false,
  cookie: {
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: app.inProduction,  // Use secure cookies in production
    sameSite: 'lax',
  },
})
