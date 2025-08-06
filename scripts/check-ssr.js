#!/usr/bin/env node

/**
 * Script pour vérifier l'état du SSR
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🔍 Vérification de l\'état SSR...')

async function checkSSR() {
  try {
    const fs = await import('fs/promises')
    
    const requiredFiles = [
      'build/client/inertia/app/ssr.js',
      'build/client/inertia/app/app.js',
      'public/assets/.vite/manifest.json'
    ]

    const status = {
      ssrEnabled: true,
      files: {},
      timestamp: new Date().toISOString()
    }

    for (const file of requiredFiles) {
      try {
        await fs.access(join(projectRoot, file))
        status.files[file] = true
        console.log(`✅ ${file} existe`)
      } catch {
        status.files[file] = false
        console.log(`❌ ${file} manquant`)
      }
    }

    // Vérifier le contenu des fichiers SSR
    if (status.files['build/client/inertia/app/ssr.js']) {
      try {
        const ssrContent = await fs.readFile(join(projectRoot, 'build/client/inertia/app/ssr.js'), 'utf8')
        if (ssrContent.includes('createInertiaApp')) {
          console.log('✅ Fichier SSR contient la logique Inertia')
        } else {
          console.log('⚠️ Fichier SSR ne contient pas la logique Inertia')
        }
      } catch (error) {
        console.log('❌ Erreur lors de la lecture du fichier SSR:', error.message)
      }
    }

    console.log('\n📊 Résumé:')
    console.log(JSON.stringify(status, null, 2))

    const allFilesExist = Object.values(status.files).every(exists => exists)
    if (allFilesExist) {
      console.log('\n✅ Tous les fichiers SSR sont présents!')
      process.exit(0)
    } else {
      console.log('\n❌ Certains fichiers SSR sont manquants!')
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
    process.exit(1)
  }
}

checkSSR()

