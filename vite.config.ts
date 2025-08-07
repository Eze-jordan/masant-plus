import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import autoprefixer from 'autoprefixer'

// Import Tailwind CSS as a PostCSS plugin
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/app.ts', } }), vue(), adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }), inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } })],
  css: {
    postcss: {
      plugins: [
        tailwindcss,  // Use the correct Tailwind PostCSS plugin
        autoprefixer,
      ],
    },
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
