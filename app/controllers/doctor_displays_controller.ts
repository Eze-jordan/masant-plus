import  { Docteur } from '#models/user'; // Assurez-vous que le modèle Docteur est bien importé
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UserController {

  // Méthode pour récupérer toutes les informations des médecins
  public async getDoctorInfo({ response }: HttpContextContract) {
    try {
      // Récupérer uniquement les utilisateurs de type 'doctor' avec toutes leurs relations
      const doctors = await Docteur.query()
        .preload('feedbacks')           // Feedbacks
        .preload('likesReceived')       // Likes reçus
        .preload('disponibilites')      // Disponibilités
        .preload('appointmentsAsDoctor') // Rendez-vous
        .where('type', 'doctor')        // Filtrer uniquement les médecins
        .orderBy('last_name', 'asc');
  
      if (!doctors.length) {
        return response.status(404).json({ message: 'Aucun médecin trouvé' });
      }
  
      // Construction de la réponse enrichie
      const doctorsInfo = doctors.map(doctor => {
        return {
          id: doctor.id,
          user: {
            email: doctor.email,
            name: `${doctor.first_name} ${doctor.last_name}`,
            address: doctor.address,
            type: doctor.type,
            profileImage: doctor.profileImage,
            accountStatus: doctor.accountStatus,
            specialisation: doctor.specialisation,
            annee_experience: doctor.anneeExperience,  // ✅ Ajouté ici
            about: doctor.about,                       // ✅ Ajouté ici
          },
          feedbacks: doctor.feedbacks?.map(f => f.message) || [],
          likesSent: doctor.likesSent?.map(like => like.id) || [],
          likesReceived: doctor.likesReceived?.map(like => like.id) || [],
          disponibilites: doctor.disponibilites?.map(dispo => dispo.dateDebut) || [],
          appointments: doctor.appointmentsAsDoctor?.map(app => app.dateRdv) || [],
        }
      });
  
      return response.status(200).json(doctorsInfo);
  
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
  }
  

}
