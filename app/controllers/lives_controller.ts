import Live from '#models/live'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LivesController {
  // Créer un Live
  public async create({ request, response }: HttpContextContract) {
    try {
      const name = request.input('name')

      if (!name) {
        return response.badRequest({ message: 'Le nom du live est requis.' })
      }

      const live = new Live()
      Live.assignUuid(live)
      live.name = name

      await live.save()

      return response.created({
        message: 'Live créé avec succès.',
        live,
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Erreur lors de la création du live.',
        error: error.message,
      })
    }
  }

  // Récupérer tous les lives
  public async index({ response }: HttpContextContract) {
    try {
      const lives = await Live.all()
      return response.ok({
        message: 'Liste des lives récupérée avec succès.',
        lives,
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des lives.',
        error: error.message,
      })
    }
  }

  // Mettre à jour un live par ID
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const live = await Live.find(params.id)

      if (!live) {
        return response.status(404).send({ message: 'Live non trouvé.' })
      }

      const name = request.input('name')
      if (name) {
        live.name = name
      }

      await live.save()

      return response.ok({
        message: 'Live mis à jour avec succès.',
        live,
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour du live.',
        error: error.message,
      })
    }
  }

  // Supprimer un live par ID
  public async delete({ params, response }: HttpContextContract) {
    try {
      const live = await Live.find(params.id)

      if (!live) {
        return response.status(404).send({ message: 'Live non trouvé.' })
      }

      await live.delete()

      return response.ok({
        message: 'Live supprimé avec succès.',
      })
    } catch (error) {
      return response.status(500).send({
        message: 'Erreur lors de la suppression du live.',
        error: error.message,
      })
    }
  }
}
