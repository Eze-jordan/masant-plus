import Notification from '#models/notification';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class NotificationController {
  
  // Récupérer toutes les notifications de l'utilisateur authentifié
  public async index({ params, response }: HttpContextContract) {
    const userId = params.id;
  
    if (!userId) {
      console.log('ID utilisateur manquant');
      return response.status(400).json({ message: 'ID utilisateur manquant' });
    }
  
    try {
      const notifications = await Notification.query()
        .where('idUser', userId)
        .preload('user') // Précharger les données de l'utilisateur
        .orderBy('createdAt', 'desc');
  
      if (notifications.length === 0) {
        console.log('Aucune notification trouvée pour cet utilisateur');
        return response.status(404).json({ message: 'Aucune notification trouvée' });
      }
  
      console.log('Notifications récupérées:', notifications);
  
      return response.status(200).json({
        userId: userId,
        notifications: notifications.map((notif) => ({
          id: notif.id,
          titre: notif.titre,
          description: notif.description,
          isRead: notif.isRead,
          createdAt: notif.createdAt.toISO(), // Format ISO pour la date
          sender: {
            id: notif.user.id,
            nom: notif.user.first_name, // ou notif.user.name selon ton modèle
            email: notif.user.email, // selon ce que tu veux afficher
          }
        }))
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return response.status(500).json({ message: 'Erreur serveur lors de la récupération des notifications' });
    }
  }
  
  

  // Récupérer une notification spécifique par ID
  public async show({ params, auth, response }: HttpContextContract) {
    const { id } = params;
    const user = auth.user;

    if (!user) {
      return response.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', user.id)
        .first();

      if (!notification) {
        return response.status(404).json({ message: 'Notification non trouvée ou vous n\'êtes pas autorisé à la voir' });
      }

      return response.status(200).json(notification);
    } catch (error) {
      console.error('Erreur lors de la récupération de la notification:', error);
      return response.status(500).json({ message: 'Erreur serveur lors de la récupération de la notification' });
    }
  }

  // Marquer une notification comme lue
  public async markAsRead({ params, request, response }: HttpContextContract) {
    const { id } = params
    const userId = request.qs().userId
  
    if (!id || !userId) {
      return response.status(400).json({ message: 'ID notification ou utilisateur manquant' })
    }
  
    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', userId)
        .first()
  
      if (!notification) {
        return response.status(404).json({
          message: 'Notification non trouvée ou utilisateur non autorisé'
        })
      }
  
      notification.isRead = true
      await notification.save()
  
      return response.status(200).json({ message: 'Notification marquée comme lue' })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
  

  // Supprimer une notification spécifique par ID
  public async destroy({ params, auth, response }: HttpContextContract) {
    const { id } = params;
    const user = auth.user;

    if (!user) {
      return response.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    try {
      const notification = await Notification.query()
        .where('id', id)
        .where('idUser', user.id)
        .first();

      if (!notification) {
        return response.status(404).json({ message: 'Notification non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
      }

      await notification.delete();
      return response.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return response.status(500).json({ message: 'Erreur serveur lors de la suppression de la notification' });
    }
  }

  // Marquer toutes les notifications comme lues
  public async markAllAsRead({ params, response }: HttpContextContract) { 
    const userId = params.id; // Récupérer l'ID de l'utilisateur à partir des paramètres de l'URL
  
    if (!userId) {
      return response.status(400).json({ message: 'ID utilisateur manquant' });
    }
  
    try {
      // Mise à jour des notifications non lues de l'utilisateur spécifié par userId
      await Notification.query()
        .where('idUser', userId)  // Utilisation de l'id utilisateur fourni
        .where('isRead', false)    // Seulement les notifications non lues
        .update({ isRead: true });
  
      return response.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues.' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      return response.status(500).json({ message: 'Erreur serveur lors de la mise à jour des notifications' });
    }
  }
  
}
