import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Feedback from '#models/feedback'
import User from '#models/user'
import { createFeedbackValidator } from '#validators/FeedbackValidator'

export default class FeedbackController {
  /**
   * Créer un feedback
   */
  public async create({ request, response }: HttpContextContract) {
    const { userId, sujet, message, note } = request.only(['userId', 'sujet', 'message', 'note'])

    try {
      const validatedData = await createFeedbackValidator.validate({
        idUser: userId,
        sujet,
        message,
        note,
      })

      const user = await User.find(userId)
      if (!user) {
        return response.status(404).send({ message: 'Utilisateur non trouvé.' })
      }

      const feedback = await Feedback.create(validatedData)

      return response.created({
        message: 'Feedback créé avec succès.',
        feedback,
      })
    } catch (error: any) {
      if (error.errors) {
        return response.status(400).send({ message: 'Erreur de validation.', errors: error.errors })
      }

      return response.status(500).send({
        message: 'Erreur lors de la création du feedback.',
        error: error.message,
      })
    }
  }

  /**
   * Mettre à jour un feedback
   */
  public async update({ params, request, response }: HttpContextContract) {
    const { userId, sujet, message, note } = request.only(['userId', 'sujet', 'message', 'note'])
    const feedbackId = params.id

    try {
      const feedback = await Feedback.find(feedbackId)
      if (!feedback) {
        return response.status(404).send({ message: 'Feedback non trouvé.' })
      }

      // 🔒 Vérifie que l'utilisateur actuel peut modifier ce feedback

      // Vérifier que le userId cible existe (optionnel si pas modifié)
      if (userId) {
        const user = await User.find(userId)
        if (!user) {
          return response.status(404).send({ message: 'Utilisateur non trouvé.' })
        }

        feedback.idUser = userId
      }

      // Mise à jour conditionnelle
      if (sujet !== undefined) feedback.sujet = sujet
      if (message !== undefined) feedback.message = message
      if (note !== undefined) feedback.note = note

      await feedback.save()

      return response.ok({
        message: 'Feedback mis à jour avec succès.',
        feedback,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la mise à jour du feedback.',
        error: error.message,
      })
    }
  }
}
