import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import autoprefixer from 'autoprefixer'
import path from 'path'
import tailwindcss from '@tailwindcss/postcss'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // AdonisJS plugin
    adonisjs({
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge']
    }),

    // Inertia plugin with SSR
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.tsx'
      }
    }),

    // React plugin
    react()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~/': `${getDirname(import.meta.url)}/inertia/`
    }
  },
  build: {
    rollupOptions: {
      input: {
        app: 'inertia/app/app.tsx',
        ssr: 'inertia/app/ssr.tsx'
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          inertia: ['@inertiajs/react']
        }
      }
    }
  }
})
