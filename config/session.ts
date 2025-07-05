import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

const sessionDriver = env.get('SESSION_DRIVER')

if (sessionDriver !== 'cookie') {
  throw new Error(
    `Invalid SESSION_DRIVER: "${sessionDriver}". You must set it to "cookie"`
  )
}

const sessionConfig = defineConfig({
  enabled: true,
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',

  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },

  store: 'cookie',

  stores: {
    cookie: stores.cookie(),
  },
})

export default sessionConfig
