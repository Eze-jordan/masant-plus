import { Docteur } from '#models/user'; // Assurez-vous que le modèle Docteur est bien importé
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UserController {

  // Méthode pour récupérer toutes les informations des médecins
  public async getDoctorInfo({ response }: HttpContextContract) {
    try {
      // Récupérer uniquement les utilisateurs de type 'doctor' avec toutes leurs relations
      const doctors = await Docteur.query()
        .preload('feedbacks')           // Feedbacks
        .preload('likesReceived')        // Likes reçus
        .preload('disponibilites')       // Disponibilités (pour le médecin)
        .preload('appointmentsAsDoctor') // Rendez-vous (pour le médecin)
        .where('type', 'doctor');        // Filtrer uniquement les médecins

      if (!doctors.length) {
        return response.status(404).json({ message: 'Aucun médecin trouvé' });
      }

      // Construction de la réponse avec toutes les données des médecins
      const doctorsInfo = doctors.map(doctor => {
        const doctorInfo = {
          id: doctor.id,  // Ajouter l'ID du médecin
          user: {
            email: doctor.email,
            name: `${doctor.first_name} ${doctor.last_name}`,
            address: doctor.address,
            type: doctor.type,
            profileImage: doctor.profileImage,
            accountStatus: doctor.accountStatus,
            specialisation: doctor.specialisation, // Ajouter la spécialisation
          },
          feedbacks: doctor.feedbacks?.map((feedback: { message: any }) => feedback.message) || [],
          likesSent: doctor.likesSent?.map((like) => like.id) || [],
          likesReceived: doctor.likesReceived?.map((like) => like.id) || [],
          disponibilites: doctor.disponibilites?.map((dispo) => dispo.dateDebut) || [],
          appointments: doctor.appointmentsAsDoctor?.map((appointment) => appointment.dateRdv) || [],
        };

        return doctorInfo;
      });

      return response.status(200).json(doctorsInfo);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
  }

}
