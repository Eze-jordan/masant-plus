import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Docteur } from '#models/user'

export default class DoctorsController {

  // Méthode pour récupérer le profil d'un médecin
  public async getDoctorProfile({ params, response }: HttpContextContract) {
    const doctorId = params.id

    const doctor = await Docteur.query()
      .where('id', doctorId)
      .andWhere('type', 'doctor')  // Vérifie que le type est bien 'doctor'
      .preload('role')  // Charge la relation role
      .first()

    if (!doctor) {
      return response.status(404).json({ message: 'Médecin non trouvé' })
    }

    // Vérifie si le rôle est défini et si c'est un "doctor" (ou "docteur")
    const roleLabel = doctor.role?.label?.toLowerCase()

    // Vérification insensible à la casse et à l'orthographe
    if (!roleLabel || !['doctor', 'docteur'].includes(roleLabel)) {
      console.log("Rôle du médecin :", doctor.role);  // Log pour vérifier le contenu du rôle
      return response.status(403).json({ message: "Utilisateur n'est pas un médecin" })
    }

    // Si tout va bien, renvoie les informations du médecin
    return response.json({
      first_name: doctor.first_name || 'Dr Inconnu',
      specialisation: doctor.specialisation || 'Spécialité inconnue',
      email: doctor.email,
      phone: doctor.phone,
      matricule: doctor.license_number || 'Matricule non défini',
      address: doctor.address || 'Adresse non précisée',
    })
  }

  // Méthode pour récupérer la spécialité du médecin
  public async getDoctorSpecialty({ params, response }: HttpContextContract) {
    const doctorId = params.userId

    const doctor = await Docteur.query()
      .where('id', doctorId)
      .preload('role')  // Charge la relation role
      .first()

    if (!doctor) {
      return response.status(404).json({ message: 'Médecin non trouvé' })
    }

    // Vérifie que le rôle est bien "doctor" (ou "docteur", insensible à la casse)
    const roleLabel = doctor.role?.label?.toLowerCase()

    if (!roleLabel || !['doctor', 'docteur'].includes(roleLabel)) {
      console.log("Rôle du médecin :", doctor.role);  // Log pour vérifier le contenu du rôle
      return response.status(403).json({ message: "Utilisateur n'est pas un médecin" })
    }

    // Renvoie la spécialité du médecin
    return response.json({
      first_name: doctor.first_name || 'Dr Inconnu',
      specialisation: doctor.specialisation || 'Spécialité inconnue',
      matricule: doctor.license_number || 'Matricule inconnu',
    })
  }

}