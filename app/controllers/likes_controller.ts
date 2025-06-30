import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Like from '#models/like'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class LikesController {
  // Créer un like
  public async create({ request, response }: HttpContextContract) {
    const { idUser, idDoctor } = request.only(['idUser', 'idDoctor'])

    try {
      // Vérifier que l'utilisateur qui like existe
      const user = await User.find(idUser)
      if (!user) {
        return response.status(404).send({ message: "Utilisateur (idUser) non trouvé." })
      }

      // Vérifier que le docteur liké existe
      const doctor = await User.find(idDoctor)
      if (!doctor) {
        return response.status(404).send({ message: "Docteur (idDoctor) non trouvé." })
      }

      // Vérifier si le like existe déjà (éviter doublons)
      const existingLike = await Like.query()
        .where('idUser', idUser)
        .andWhere('idDoctor', idDoctor)
        .first()

      if (existingLike) {
        return response.status(409).send({ message: 'Like déjà existant.' })
      }

      // Créer le like avec la date actuelle
      const like = await Like.create({
        idUser,
        idDoctor,
        date: DateTime.now(),
      })

      return response.created({
        message: 'Like créé avec succès.',
        like,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la création du like.',
        error: error.message,
      })
    }
  }

  // Récupérer tous les likes pour un docteur donné
  public async getLikesForDoctor({ params, response }: HttpContextContract) {
    const doctorId = params.idDoctor

    try {
      // Vérifier que le docteur existe
      const doctor = await User.find(doctorId)
      if (!doctor) {
        return response.status(404).send({ message: "Docteur non trouvé." })
      }

      // Récupérer les likes liés au docteur, avec les infos des utilisateurs qui ont liké
      const likes = await Like.query()
        .where('idDoctor', doctorId)
        .preload('user')

      return response.ok({
        message: `Likes pour le docteur ${doctorId} récupérés avec succès.`,
        likes,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des likes.',
        error: error.message,
      })
    }
  }
  // Supprimer un like
  public async deleteLikesForDoctor({ params, response }: HttpContextContract) {
    const doctorId = params.idDoctor
  
    try {
      // Vérifier que le docteur existe
      const doctor = await User.find(doctorId)
      if (!doctor) {
        return response.status(404).send({ message: "Docteur non trouvé." })
      }
  
      // Supprimer tous les likes du docteur
      await Like.query().where('idDoctor', doctorId).delete()
  
      return response.ok({ message: `Tous les likes du docteur ${doctorId} ont été supprimés.` })
    } catch (error: any) {
      return response.status(500).send({
        message: "Erreur lors de la suppression des likes.",
        error: error.message,
      })
    }
  }
  
  
}
