import { defineConfig, stores } from '@adonisjs/session'
import app from '@adonisjs/core/services/app'

// Définir la configuration des sessions
const sessionConfig = defineConfig({
  enabled: true,
  cookieName: 'adonis-session',

  /**
   * Quand activé, le cookie de session sera supprimé dès que l'utilisateur ferme le navigateur.
   */
  clearWithBrowser: false,

  /**
   * Temps d'expiration de la session sans activité.
   */
  age: '2h',

  /**
   * Configuration du cookie de session.
   */
  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,  // Utilise 'true' si en production, sinon 'false'
    sameSite: 'lax',
  },

  /**
   /**
    * Choix du store (base de données, fichier, cookie, etc.)
    * Seuls 'cookie' et 'memory' sont supportés par défaut.
    */
   store: (process.env.SESSION_DRIVER as 'cookie' | 'memory') || 'cookie',

   /**
    * Stores configurés. Actuellement, on a un store pour les cookies.
    */
  stores: {
    cookie: stores.cookie(),
    // Si tu souhaites utiliser une base de données ou Redis, tu peux les ajouter ici.
    // Exemple : 
    // redis: stores.redis(),
    // database: stores.database(),
  }
})

export default sessionConfig
