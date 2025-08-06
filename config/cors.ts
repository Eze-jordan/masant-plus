import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
   enabled: true,
  origin: true, // accepte toutes origines (en dev)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization', 'x-app-key'],
  exposeHeaders: ['x-app-key'],
  credentials: false, // true si tu veux cookies, sinon false
  maxAge: 90,
})

export default corsConfig