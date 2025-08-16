import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: ['*'], // Autorise explicitement toutes les origines (à modifier en production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Toutes les méthodes nécessaires
  headers: ['Content-Type', 'Authorization', 'x-app-key', 'Accept'], // Headers autorisés
  credentials: true, // Important si vous utilisez des cookies/sessions
  maxAge: 90,
})

export default corsConfig
