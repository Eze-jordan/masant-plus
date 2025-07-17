import Specialite from '#models/specialite'
import SpecialiteDoctor from '#models/specialite_doctor'
import { Docteur } from '#models/user'

export default class AssociateSpecialites {
  public static async handle() {
    try {
      // Attendre 1 minute (60 000 ms)
      await this.delay(60000)

      // Récupère les docteurs qui ont une spécialisation
      const doctors = await Docteur.query()
        .where('type', 'doctor')
        .whereNotNull('specialisation')  // Assurer que le docteur a une spécialisation
        .whereNotExists((query) => {
          query.from('specialite_doctors')
            .whereRaw('specialite_doctors.idDoctor = users.id')  // Vérifie que le docteur n'est pas déjà associé
        })

      if (doctors.length === 0) {
        console.log('[AssociateSpecialites] Aucun docteur avec spécialisation à associer.')
        return
      }

      for (const doctor of doctors) {
        const specialisationLabel = doctor.specialisation // ✅ Lecture de la spécialisation (nom)

        if (!specialisationLabel) continue // Si pas de spécialisation assignée, on passe au suivant

        // Vérifier si la spécialisation existe déjà
        let specialite = await Specialite.query().where('label', specialisationLabel).first()

        if (!specialite) {
          // Si la spécialité n'existe pas, on la crée
          specialite = await Specialite.create({
            label: specialisationLabel, // Crée une nouvelle spécialité avec le nom de la spécialisation
          })
          console.log(`[AssociateSpecialites] Nouvelle spécialité créée: ${specialisationLabel}`)
        }

        // Vérifier si la relation existe déjà dans la table pivot
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

  // Fonction pour créer une pause de 'temps' millisecondes
  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
