import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  
  // Méthode pour récupérer toutes les informations de l'utilisateur
  public async getUserInfo({ params, response }: HttpContextContract) {
    const userId = params.id  // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    try {
      // Récupérer l'utilisateur avec toutes ses relations
      const user = await User.query()
        .preload('feedbacks')           // Feedbacks
        .preload('likesReceived')        // Likes reçus
        .preload('disponibilites')       // Disponibilités (pour le médecin)
        .preload('appointmentsAsDoctor') // Rendez-vous (pour le médecin)
        .where('id', userId)             // Filtrer par l'ID de l'utilisateur
        .first()

      if (!user) {
        return response.status(404).json({ message: 'Utilisateur non trouvé' })
      }

      // Construction de la réponse avec toutes les données utilisateur
      const userInfo = {
        user: {
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          address: user.address,
          type: user.type,
          accountStatus: user.accountStatus,
        },
        feedbacks: user.feedbacks.map((feedback: { message: any }) => feedback.message),
        likesSent: user.likesSent.map((like) => like.id),
        likesReceived: user.likesReceived.map((like) => like.id),
        disponibilites: user.disponibilites.map((dispo) => dispo.dateDebut),
        appointments: user.appointmentsAsDoctor.map((appointment) => appointment.dateRdv),
      }

      return response.status(200).json(userInfo)

    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Erreur lors de la récupération des données' })
    }
  }
}
