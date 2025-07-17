import Specialite from '#models/specialite'
import SpecialiteDoctor from '#models/specialite_doctor'
import User ,{Docteur} from '#models/user'

export default class AssociateSpecialites {
  public static async handle() {
    try {
      // Récupère les docteurs qui n'ont pas encore été liés à une spécialité dans la table pivot
      const doctors = await Docteur.query()
        .where('type', 'doctor')
        .whereNotNull('specialite_id')  // Assurer que le doctor a une spécialité
        .whereNotExists((query) => {
          query.from('specialite_doctors')
            .whereRaw('specialite_doctors.idDoctor = users.id')  // Vérifie que le docteur n'est pas déjà associé
        })

      if (doctors.length === 0) {
        console.log('[AssociateSpecialites] Aucun docteur à associer.')
        return
      }

      for (const doctor of doctors) {
        const specialiteId = doctor.specialisation // ✅ Lecture du champ de spécialisation

        if (!specialiteId) continue // Si pas de spécialité assignée, on passe au suivant

        const specialite = await Specialite.find(specialiteId)
        if (!specialite) {
          console.log(`[AssociateSpecialites] Spécialité avec l'ID ${specialiteId} non trouvée.`)
          continue
        }

        // Vérifie si la relation existe déjà dans la table pivot
        const exists = await SpecialiteDoctor.query()
          .where('idDoctor', doctor.id)
          .andWhere('idSpecialite', specialite.id)
          .first()

        if (!exists) {
          // Crée la relation dans la table pivot
          await SpecialiteDoctor.create({
            idDoctor: doctor.id,
            idSpecialite: specialite.id,
          })
          console.log(`[AssociateSpecialites] Docteur ${doctor.email} associé à la spécialité ${specialite.label}`)
        }
      }
    } catch (error) {
      console.error('[AssociateSpecialites] Erreur lors de l\'association des spécialités:', error)
    }
  }
}
