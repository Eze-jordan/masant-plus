import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { join } from 'path'
import { promises as fs } from 'fs'

export default class UploadController {
  public async show({ params, response }: HttpContextContract) {
    const fileName = params.filename
    const filePath = join(process.cwd(), 'public/uploads/documents', fileName)

    try {
      // Vérifie si le fichier existe
      await fs.access(filePath)

      // Lis le fichier
      const fileBuffer = await fs.readFile(filePath)

      // Détection du type MIME selon l'extension
      const extension = fileName.split('.').pop()?.toLowerCase()

      switch (extension) {
        case 'png':
          response.header('Content-Type', 'image/png')
          break
        case 'jpg':
        case 'jpeg':
          response.header('Content-Type', 'image/jpeg')
          break
        case 'pdf':
          response.header('Content-Type', 'application/pdf')
          break
        default:
          response.header('Content-Type', 'application/octet-stream')
      }

      return response.send(fileBuffer)
    } catch (error) {
      return response.status(404).send({ error: 'Fichier introuvable' })
    }
  }
}
