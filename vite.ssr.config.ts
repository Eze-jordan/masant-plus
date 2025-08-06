import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'inertia/app/ssr.tsx',
    outDir: 'build/client/inertia/app',
    rollupOptions: {
      input: {
        ssr: 'inertia/app/ssr.tsx',
        app: 'inertia/app/app.tsx'
      },
      output: {
        format: 'esm',
        entryFileNames: '[name].js'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~/': `${getDirname(import.meta.url)}/inertia/`
    }
  }
})
