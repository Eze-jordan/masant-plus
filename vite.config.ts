// vite.config.ts
import { defineConfig } from 'vite';
import adonisjs from '@adonisjs/vite/client';
import inertia from '@adonisjs/inertia/client';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // AdonisJS plugin configuration
    adonisjs({
      entrypoints: ['resources/js/app.js'], // Point d'entrée pour le JavaScript
      reload: ['resources/views/**/*.edge'], // Rechargement à chaud des vues Edge
    }),

    // InertiaJS plugin configuration pour SSR
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.tsx', // Point d'entrée SSR pour InertiaJS
      },
    }),

    // Plugin React pour la gestion des fichiers JSX
    react(),
  ],

  build: {
    // Personnalisation du répertoire des assets si nécessaire
    assetsDir: 'assets', // Assurez-vous que le chemin des assets est correct
  },

  server: {
    // Configuration du proxy pour les assets si nécessaire
    proxy: {
      '/assets': 'http://localhost:3000/assets', // Modifiez ce chemin selon votre besoin
    },
  },

  define: {
    // Définir la variable d'environnement dans le code de build
    'process.env.VITE_ASSETS_URL': JSON.stringify(process.env.VITE_ASSETS_URL || '/assets'),
  },
});
