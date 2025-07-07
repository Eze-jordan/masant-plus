import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import autoprefixer from 'autoprefixer'
import path from 'path'

// Import Tailwind CSS as a PostCSS plugin
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [
    // Configuration d'Inertia pour SSR
    inertia({
      ssr: {
        enabled: true,  // Activation de SSR
        entrypoint: 'inertia/app/ssr.ts', // Fichier d'entrée SSR
      },
    }),

    // Plugin Vue pour Vite
    vue(),

    // Plugin AdonisJS pour Vite
    adonisjs({
      entrypoints: ['inertia/app/app.ts'],  // Fichier d'entrée pour le client
      reload: ['resources/views/**/*.edge'],  // Déclenche un rechargement lors de modifications d'Edge views
    }),
  ],

  // Configuration CSS avec Tailwind et autoprefixer
  css: {
    postcss: {
      plugins: [
        tailwindcss,  // Plugin pour Tailwind CSS
        autoprefixer,  // Plugin pour autoprefixer
      ],
    },
  },

  // Résolution des alias pour faciliter l'importation
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~/': `${getDirname(import.meta.url)}/inertia/`,  // Alias pour les pages Inertia
    },
  },

  // Options de construction (build)
  build: {
    ssr: true, // Active SSR lors de la construction du projet
    outDir: 'public/assets', // Répertoire de sortie pour les fichiers construits
    rollupOptions: {
      input: '/src/entry-server.ts', // Entrée SSR pour la construction
    },
  },

})
