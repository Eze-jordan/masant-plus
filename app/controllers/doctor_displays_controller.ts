import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {

  // Méthode pour récupérer toutes les informations de tous les utilisateurs
  public async getUserInfo({ response }: HttpContextContract) {
    try {
      // Récupérer tous les utilisateurs avec toutes leurs relations
      const users = await User.query()
        .preload('feedbacks')           // Feedbacks
        .preload('likesReceived')        // Likes reçus
        .preload('disponibilites')       // Disponibilités (pour le médecin)
        .preload('appointmentsAsDoctor') // Rendez-vous (pour le médecin)

      if (!users.length) {
        return response.status(404).json({ message: 'Aucun utilisateur trouvé' })
      }

      // Construction de la réponse avec toutes les données des utilisateurs
      const usersInfo = users.map(user => ({
        id: user.id,  // Ajouter l'ID de l'utilisateur
        user: {
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          address: user.address,
          type: user.type,
          accountStatus: user.accountStatus,
        },
        feedbacks: user.feedbacks?.map((feedback: { message: any }) => feedback.message) || [],
        likesSent: user.likesSent?.map((like) => like.id) || [],
        likesReceived: user.likesReceived?.map((like) => like.id) || [],
        disponibilites: user.disponibilites?.map((dispo) => dispo.dateDebut) || [],
        appointments: user.appointmentsAsDoctor?.map((appointment) => appointment.dateRdv) || [],
      }));

      return response.status(200).json(usersInfo);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
  }
}