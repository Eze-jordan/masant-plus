import  { Docteur } from '#models/user'; // Assurez-vous que le modèle Docteur est bien importé
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UserController {

  // Méthode pour récupérer toutes les informations des médecins
  public async getDoctorInfo({ response }: HttpContextContract) {
    try {
      const doctors = await Docteur.query()
        .preload('feedbacks')
        .preload('likesReceived', (likeQuery) => {
          likeQuery.preload('user');
        })
        .preload('disponibilites')
        .preload('appointmentsAsDoctor')
        .where('type', 'doctor')
        .where('account_status', 'ACTIVE') // ✅ Ajout du filtre sur le statut
        .orderBy('last_name', 'asc');
  
      if (!doctors.length) {
        return response.status(404).json({ message: 'Aucun médecin actif trouvé' });
      }
  
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
            annee_experience: doctor.anneeExperience,
            about: doctor.about,
          },
          feedbacks: doctor.feedbacks?.map(f => f.message) || [],
          likesSent: doctor.likesSent?.map(like => like.id) || [],
          likesReceived: doctor.likesReceived?.map(like => ({
            likeId: like.id,
            userId: like.user?.id,
            userEmail: like.user?.email,
          })) || [],
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

    public async index({ response }: HttpContextContract) {
    // Récupère tous les docteurs
    const docteurs = await Docteur.all()
    return response.ok(docteurs)
  }
  
}
