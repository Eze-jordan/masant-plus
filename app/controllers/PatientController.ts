import Role from '#models/role'
import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientsController {

    public async index({ response }: HttpContextContract) {
      try {
        const patientRole = await Role.findByOrFail('label', 'patient');
  
        const patients = await User
          .query()
          .where('role_id', patientRole.id);
  
        return response.ok(patients);
      } catch (error) {
        console.error('Erreur Patient index:', error);
        // Renvoyer une réponse 200 avec message d'erreur (pas recommandé mais possible)
        return response.ok({ data: [], message: 'Erreur serveur, impossible de récupérer les patients' });
      }
    }
  }
  