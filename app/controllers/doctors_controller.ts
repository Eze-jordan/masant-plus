import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DoctorsController {
  /**
   * 🔍 Récupérer le profil complet du médecin
   */
  public async getDoctorProfile({ params, response }: HttpContextContract) {
    const doctorId = params.id

    const doctor = await User.query()
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
      matricule: doctor.license_number || 'Matricule non défini',  // <-- Ajout matricule ici
      address: doctor.address,
    })
  }

  /**
   * 🎯 Récupérer uniquement la spécialisation du médecin
   */
  public async getDoctorSpecialty({ params, response }: HttpContextContract) {
    const doctorId = params.userId

    const doctor = await User.query()
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
      fullName: doctor.username || 'Dr Inconnu',
      specialisation: doctor.specialisation || 'Spécialité inconnue',
      matricule: doctor.licenseNumber || 'Matricule non défini',  // <-- Aussi ici si besoin
    })
  }
}
