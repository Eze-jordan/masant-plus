import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import autoprefixer from 'autoprefixer'

// Import Tailwind CSS as a PostCSS plugin
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },

  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },

  // 🟢 AJOUT OBLIGATOIRE POUR CORRIGER TON ERREUR
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'api-masanteplus.solutech-one.com', // ton domaine autorisé
    ],
    host: true, // utile si tu serres derrière un proxy
  },
})
