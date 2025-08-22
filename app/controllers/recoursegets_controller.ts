import Ressource from '#models/Ressource'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RecoursegetsController {
  public async getRessourcesByUser({ params, response }: HttpContextContract) {
    const userId = params.userId  // Récupérer l'userId dans l'URL

    // Log pour vérifier que l'userId est bien reçu
    console.log('[getRessourcesByUser] userId:', userId)

    try {
      // Récupérer les ressources associées à cet utilisateur
      const ressources = await Ressource.query()
        .where('userId', userId)
        .select('id', 'url')  // Récupérer l'ID et l'URL des ressources

      // Log pour vérifier si des ressources ont été récupérées
      console.log('[getRessourcesByUser] Ressources:', ressources)

      if (ressources.length === 0) {
        // Retourner une réponse avec un message d'erreur si aucune ressource n'est trouvée
        return response.status(404).json({
          message: `Aucune ressource trouvée pour l'utilisateur ${userId}.`,
          data: [],
        })
      }

      // Extraire seulement l'ID du fichier dans l'URL et préparer la réponse
      const ressourcesIds = ressources.map((ressource) => {
        const ressourceJson = ressource.toJSON()

        // Log pour vérifier le modèle converti en JSON
        console.log('[getRessourcesByUser]  Ressource JSON:', ressourceJson)

        // Extraire le nom du fichier à partir de l'URL
        const urlParts = ressourceJson.url.split('/')
        const fileName = urlParts[urlParts.length - 1].split('?')[0]  // Extrait juste le nom du fichier sans la signature

        // Log pour voir le nom du fichier extrait
        console.log('[getRessourcesByUser] Nom du fichier:', fileName)

        return {
          id: ressourceJson.id,
          fileName,  // Retourne juste le nom du fichier
        }
      })

      // Retourner les ressources avec les noms des fichiers
      return response.status(200).json({
        message: `Ressources de l'utilisateur ${userId} récupérées avec succès.`,
        data: ressourcesIds,  // Retourne la liste complète des ressources avec leur nom de fichier et ID
      })
    } catch (error) {
      console.error('[getRessourcesByUser] Erreur:', error.message)

      // Retourner une erreur serveur si quelque chose échoue dans la récupération
      return response.status(500).json({
        message: 'Une erreur est survenue lors de la récupération des ressources.',
        error: error.message,
      })
    }
  }
}
