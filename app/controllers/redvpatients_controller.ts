import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Appointment from '#models/appointment'
import User from '#models/user'

export default class RedvpatientsController {
  // Vérifie si un patient a un rendez-vous aujourd'hui
  public async hasAppointmentToday({ params, response }: HttpContextContract) {
    console.log("User ID:", params.id); // Vérification du paramètre ID

    const userId = params.id;

    // Si l'ID est inexistant ou invalide, retourne une erreur
    if (!userId) {
      return response.status(400).json({ message: "ID utilisateur manquant" });
    }

    // Récupère l'utilisateur
    const user = await User.find(userId);
    if (!user) {
      return response.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie que l'utilisateur est bien un patient
    if (user.type !== 'patient') {
      return response.status(400).json({ message: 'Cet utilisateur n\'est pas un patient' });
    }

    // Date d'aujourd'hui (commence à 00h00 et finit à 23h59)
    const todayStart = DateTime.local().startOf('day').toISO(); // Début de la journée
    const todayEnd = DateTime.local().endOf('day').toISO();   // Fin de la journée

    // Cherche un rendez-vous pour cet utilisateur (en tant que patient) aujourd'hui
    const appointment = await Appointment.query()
      .where('idUser', user.id)  // Utilise 'idUser' comme colonne représentant le patient
      .whereBetween('dateRdv', [todayStart, todayEnd]) // Vérifie si la date du RDV est aujourd'hui
      .first();

    if (appointment) {
      return response.status(200).json({ hasAppointment: true, appointment });
    }

    return response.status(200).json({ hasAppointment: false });
  }
}
