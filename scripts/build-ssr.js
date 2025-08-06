#!/usr/bin/env node

/**
 * Script pour construire les fichiers SSR
 */

import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔨 Construction des fichiers SSR...')

async function buildSSR() {
  try {
    // Build AdonisJS
    console.log('📦 Build AdonisJS...')
    await runCommand('npm', ['run', 'build'])

    // Build Vite avec SSR
    console.log('🎨 Build Vite avec SSR...')
    await build({
      root: projectRoot,
      configFile: join(projectRoot, 'vite.ssr.config.ts')
    })

    // Build Vite normal pour les assets
    console.log('🌐 Build Vite pour les assets...')
    await build({
      root: projectRoot,
      configFile: join(projectRoot, 'vite.config.ts')
    })

    console.log('✅ Build SSR terminé avec succès!')
    
    // Vérifier les fichiers générés
    const fs = await import('fs/promises')
    const files = [
      'build/client/inertia/app/ssr.js',
      'build/client/inertia/app/app.js',
      'public/assets/.vite/manifest.json'
    ]

    for (const file of files) {
      try {
        await fs.access(join(projectRoot, file))
        console.log(`✅ ${file} généré`)
      } catch {
        console.log(`❌ ${file} manquant`)
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors du build SSR:', error)
    process.exit(1)
  }
}

function runCommand(command, args = [], cwd = projectRoot) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

buildSSR()
