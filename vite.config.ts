import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    // Désactiver complètement SSR pour Inertia
    inertia({ ssr: { enabled: false } }),  // Déjà désactivé
    react(),
    adonisjs({ 
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge'],
      // Si vous avez un autre paramètre SSR, vous pouvez aussi le désactiver ici
      
    })
  ],

  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
