#!/usr/bin/env node

/**
 * Script de build simple sans SSR
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔨 Build simple sans SSR...')

async function buildSimple() {
  try {
    // Build AdonisJS
    console.log('📦 Build AdonisJS...')
    await runCommand('npm', ['run', 'build'])

    // Build Vite pour les assets
    console.log('🌐 Build Vite pour les assets...')
    await runCommand('npx', ['vite', 'build'])

    console.log('✅ Build simple terminé avec succès!')
    
    // Vérifier les fichiers générés
    const fs = await import('fs/promises')
    const files = [
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
    console.error('❌ Erreur lors du build:', error)
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

buildSimple()
