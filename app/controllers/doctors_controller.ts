import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Docteur } from '#models/user'  // Importation du modèle Docteur

export default class DoctorsController {
  public async getDoctorProfile({ params, response }: HttpContextContract) {
    const doctorId = params.id

    // Récupérer un Docteur au lieu de User
    const doctor = await Docteur.query()
      .where('id', doctorId)
      .preload('role')
      .first()

    if (!doctor) {
      return response.status(404).json({ message: 'Médecin non trouvé' })
    }

    if (!doctor.role || doctor.role.label.toLowerCase() !== 'doctor') {
      return response.status(403).json({ message: "Utilisateur n'est pas un médecin" })
    }

    return response.json({
      fullName: doctor.first_name || 'Dr Inconnu',
      specialisation: doctor.specialisation || 'Spécialité inconnue',
      email: doctor.email,
      phone: doctor.phone,
      matricule: doctor.license_number || 'Matricule non défini',  // Ajout matricule ici
      address: doctor.address,
    })
  }

  public async getDoctorSpecialty({ params, response }: HttpContextContract) {
    const doctorId = params.userId

    // Récupérer un Docteur au lieu de User
    const doctor = await Docteur.query()
      .where('id', doctorId)
      .preload('role')
      .first()

    if (!doctor) {
      return response.status(404).json({ message: 'Médecin non trouvé' })
    }

    if (!doctor.role || doctor.role.label.toLowerCase() !== 'doctor') {
      return response.status(403).json({ message: "Utilisateur n'est pas un médecin" })
    }

    return response.json({
      specialisation: doctor.specialisation || 'Spécialité inconnue',
      matricule: doctor.license_number || 'Matricule non défini',
    })
  }
}
