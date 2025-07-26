import Role from '#models/role'
import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientdetailsController {

  // Méthode pour récupérer un patient par son id, mais seulement ses informations personnelles
  public async show({ response, params }: HttpContextContract) {
    try {
      // Trouver le rôle "patient" (même si on récupère un patient par ID, on peut vouloir vérifier le rôle)
      const patientRole = await Role.findByOrFail('label', 'patient');

      // Récupérer le patient avec l'ID spécifié mais ne charger que ses informations personnelles
      const patient = await User
        .query()
        .where('role_id', patientRole.id) // Vérifier que c'est bien un patient
        .andWhere('id', params.id) // Filtrer par ID
        .select('id', 'first_name', 'last_name', 'email', 'phone', 'dateNaissance', 'about', 'groupeSanguin', 'anneeExperience', 'address', 'profileImage')  // Sélectionner uniquement les infos personnelles
        .first(); // Assurer qu'il n'y a qu'un seul patient avec cet ID

      // Vérifier si le patient a été trouvé
      if (!patient) {
        return response.notFound({ message: 'Patient non trouvé' });
      }

      // Retourner le patient avec ses informations personnelles
      return response.ok(patient);
    } catch (error) {
      console.error('Erreur Patient show:', error);
      return response.internalServerError({ message: 'Erreur serveur, impossible de récupérer le patient' });
    }
  }
}
