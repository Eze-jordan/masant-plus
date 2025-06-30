import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Suggestion from '#models/suggestion'
import User from '#models/user'
import { StatutSuggestion } from '../enum/enums.js'

export default class SuggestionController {
  // Créer une suggestion
  public async create({ request, response }: HttpContextContract) {
    const { idUser, titre, description, statut } = request.only([
      'idUser',
      'titre',
      'description',
      'statut',
    ])

    try {
      const user = await User.find(idUser)
      if (!user) {
        return response.status(404).send({ message: 'Utilisateur non trouvé.' })
      }

      if (statut && !Object.keys(StatutSuggestion).includes(statut)) {
        return response.status(400).send({ message: 'Statut invalide.' })
      }

      const suggestion = await Suggestion.create({
        idUser,
        titre,
        description,
        statut: statut || 'pending',
      })

      return response.created({
        message: 'Suggestion créée avec succès.',
        suggestion,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la création de la suggestion.',
        error: error.message,
      })
    }
  }

  // Mettre à jour une suggestion
  public async update({   params, request, response }: HttpContextContract) {
    const { titre, description, statut } = request.only(['titre', 'description', 'statut'])
    const suggestionId = params.id

    try {
      const suggestion = await Suggestion.find(suggestionId)
      if (!suggestion) {
        return response.status(404).send({ message: 'Suggestion non trouvée.' })
      }

      // 🔐 Vérification Bouncer
    


      if (statut && !Object.keys(StatutSuggestion).includes(statut)) {
        return response.status(400).send({ message: 'Statut invalide.' })
      }

      if (titre !== undefined) suggestion.titre = titre
      if (description !== undefined) suggestion.description = description
      if (statut !== undefined) suggestion.statut = statut

      await suggestion.save()

      return response.ok({
        message: 'Suggestion mise à jour avec succès.',
        suggestion,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour de la suggestion.',
        error: error.message,
      })
    }
  }

  // Supprimer une suggestion
  public async delete({   params, response }: HttpContextContract) {
    try {
      const suggestion = await Suggestion.find(params.id)
      if (!suggestion) {
        return response.status(404).send({ message: 'Suggestion non trouvée.' })
      }

      // 🔐 Vérification Bouncer


      await suggestion.delete()

      return response.ok({
        message: 'Suggestion supprimée avec succès.',
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la suppression de la suggestion.',
        error: error.message,
      })
    }
  }

  // Récupérer toutes les suggestions
  public async getAll({ response }: HttpContextContract) {
    try {
      const suggestions = await Suggestion.query().preload('user')

      return response.ok({
        message: 'Liste des suggestions récupérée avec succès.',
        suggestions,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des suggestions.',
        error: error.message,
      })
    }
  }

  // Récupérer une suggestion par ID
  public async getById({ params, response }: HttpContextContract) {
    try {
      const suggestion = await Suggestion.query()
        .where('id', params.id)
        .preload('user')
        .first()

      if (!suggestion) {
        return response.status(404).send({ message: 'Suggestion non trouvée.' })
      }

      return response.ok(suggestion)
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération de la suggestion.',
        error: error.message,
      })
    }
  }
}
