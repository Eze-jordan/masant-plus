import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss'

// Configuration SSR
export default defineConfig({
  plugins: [
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/app.ts', // Assure-toi que le point d'entrée SSR est correct
      },
    }),
    vue(),
    adonisjs({
      entrypoints: ['inertia/app/app.ts'],
      reload: ['resources/views/**/*.edge'],
    }),
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
  build: {
    outDir: 'public/assets',   // Vérifie le répertoire de sortie
    manifest: true,
    rollupOptions: {
      input: 'inertia/app/app.ts',
    },
    ssr: true,                  // Active SSR dans Vite
    ssrManifest: true,  
     }       // Génère le manifeste SSR},
})
