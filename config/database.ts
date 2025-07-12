import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg',
  connections: {
    pg: {
      debug: true,
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT')),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: env.get('SSL') === 'true' ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: 0,
        max: 10, // Ajuste ce nombre selon la charge prévue et capacité serveur
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
