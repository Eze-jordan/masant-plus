import Prescription from '#models/prescription'
import Role from '#models/role'
import User from '#models/user'
import Appointment from '#models/appointment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientdetailsController {
  // Méthode pour récupérer un patient par son id, mais seulement ses informations personnelles
  public async show({ response, params }: HttpContextContract) {
    try {
      // Trouver le rôle "patient"
      const patientRole = await Role.findByOrFail('label', 'patient');

      // Récupérer le patient avec l'ID spécifié mais ne charger que ses informations personnelles
      const patient = await User
        .query()
        .where('role_id', patientRole.id) // Vérifier que c'est bien un patient
        .where('id', params.id) // Filtrer par ID
        .select('id', 'first_name', 'last_name', 'email', 'phone', 'dateNaissance', 'about', 'groupeSanguin', 'anneeExperience', 'address', 'profileImage')  // Sélectionner uniquement les infos personnelles
        .first(); // Assurer qu'il n'y a qu'un seul patient avec cet ID

      // Vérifier si le patient a été trouvé
      if (!patient) {
        return response.notFound({ message: 'Patient non trouvé' });
      }

      // Récupérer les rendez-vous du patient et les informations du docteur associé
      const appointments = await Appointment
        .query()
        .where('idUser', patient.id) // Filtrer les rendez-vous pour ce patient
        .preload('doctor') // Charger les informations du docteur associé à chaque rendez-vous
        .orderBy('dateRdv', 'desc'); // Optionnel : trier par date (les plus récents en premier)

      // Récupérer les prescriptions du patient via ses rendez-vous
      const prescriptions = await Prescription
        .query()
        .whereIn('idAppointment', appointments.map(appointment => appointment.id)) // Filtrer les prescriptions par rendez-vous
        .orderBy('createdAt', 'desc'); // Optionnel : trier par date de création de la prescription

      // Retourner le patient avec ses informations personnelles, ses rendez-vous et ses prescriptions
      return response.ok({ patient, appointments, prescriptions });

    } catch (error) {
      console.error('Erreur Patient show:', error);
      return response.internalServerError({ message: 'Erreur serveur, impossible de récupérer le patient' });
    }
  }
}
