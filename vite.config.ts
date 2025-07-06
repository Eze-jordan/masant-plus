import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inertia from '@adonisjs/inertia/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }), // Désactive SSR
    react(),
  ],
  resolve: {
    alias: {
      '~/': '/inertia/',
    },
  },
})
