import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // AdonisJS plugin configuration
    adonisjs({
      entrypoints: ['resources/js/app.js'], // main JS entry point
      reload: ['resources/views/**/*.edge'], // enable hot-reloading for Edge templates
    }),

    // InertiaJS plugin configuration for SSR
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.tsx' // SSR entry point for Inertia app
      },
    }),

    // React plugin for JSX and React support
    react(),

    // Optional: Additional AdonisJS entry point for SSR if needed
    adonisjs({
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] })
  ],
})
