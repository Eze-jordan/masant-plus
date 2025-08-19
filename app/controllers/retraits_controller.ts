import Notification from "#models/notification";
import Paiement from "#models/paiement"
import User from "#models/user";
import { StatusPaiement } from "../enum/enums.js"

export default class PaiementsController {
  /**
   * Récupérer tous les retraits d'un utilisateur
   */

public async retraitsParUser({ params, response }: { params: { id: string }, response: any }) {
  const { id } = params; // Récupérer l'ID de l'utilisateur depuis les paramètres de la route

  try {
    // Récupérer tous les paiements ayant le statut 'RETRAIT' pour cet utilisateur
    const retraits = await Paiement
      .query()
      .where('idUser', id)
      .andWhere('statut', StatusPaiement.RETRAIT) // Utilisation de l'enum pour filtrer les retraits
      .preload('mode') // Charger les informations du mode de paiement
      .preload('appointment') // Charger les informations du rendez-vous
      .orderBy('datePaiement', 'desc'); // Trier les retraits par date de paiement (descendant)

    // Vérifie si des retraits ont été trouvés
    if (retraits.length === 0) {
      // Si aucun retrait, on crée une notification
      const user = await User.find(id);  // Trouver l'utilisateur par son ID

      if (user) {
        // Créer la notification dans la base de données
        await Notification.create({
          idUser: user.id,
          titre: 'Aucun retrait trouvé',
          description: `Il n'y a aucun retrait effectué pour votre compte.`,
          isRead: false, // La notification est non lue par défaut
        });

        // Si l'utilisateur a un expoPushToken, envoyer une notification push
        if (user?.expoPushToken) {
          const pushMessage = {
            to: user.expoPushToken,
            title: 'Aucun retrait effectué',
            body: 'Il n\'y a aucun retrait effectué pour votre compte.',
            data: { retraits }, // Tu peux inclure plus d'infos ici si tu veux
          };

          try {
            const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(pushMessage),
            });

            // Type assertion pour résoudre 'unknown' en 'any'
            const responseData = await pushResponse.json() as { errors?: string[] };

            if (responseData.errors) {
              console.error('Erreur d\'envoi de notification push Expo:', responseData.errors);
            } else {
              console.log('Notification push Expo envoyée avec succès');
            }
          } catch (error) {
            console.error('Erreur lors de l\'envoi de la notification push Expo:', error);
          }
        }
      }

      return response.status(404).json({ message: 'Aucun retrait trouvé pour cet utilisateur.' });
    }

    // Si des retraits sont trouvés, on crée une notification pour l'utilisateur
    const user = await User.find(id); // Trouver l'utilisateur

    if (user) {
      // Créer la notification dans la base de données
      await Notification.create({
        idUser: user.id,
        titre: 'Retraits effectués',
        description: `Vous avez ${retraits.length} retraits effectués récemment.`,
        isRead: false, // La notification est non lue
      });

      // Envoi de la notification push Expo
      if (user?.expoPushToken) {
        const pushMessage = {
          to: user.expoPushToken,
          title: 'Retraits effectués',
          body: `Vous avez ${retraits.length} retraits effectués récemment.`,
          data: { retraits },  // Envoyer les détails des retraits
        };

        try {
          const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pushMessage),
          });

          // Type assertion pour résoudre 'unknown' en 'any'
          const responseData = await pushResponse.json() as { errors?: string[] };

          if (responseData.errors) {
            console.error('Erreur d\'envoi de notification push Expo:', responseData.errors);
          } else {
            console.log('Notification push Expo envoyée avec succès');
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de la notification push Expo:', error);
        }
      }
    }

    return response.ok(retraits); // Retourner les retraits
  } catch (error) {
    // Gérer les erreurs en cas de problème avec la requête
    return response.status(500).json({ message: 'Erreur lors de la récupération des retraits', error });
  }
}
  }
