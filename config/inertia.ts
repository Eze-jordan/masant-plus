import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  sharedData: {
    appName: 'My App', // 👈 This will be available in all views
    user: (ctx) => ctx.auth?.user, // 👈 Scoped to the current request
  },
})
