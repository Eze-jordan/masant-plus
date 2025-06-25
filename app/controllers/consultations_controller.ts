import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appointment from '#models/appointment'

export default class AppointmentsController {
  public async list({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId

      const appointments = await Appointment
        .query()
        .where('id_user', userId)
        .preload('patient', (query) => {
          query.select(['id', 'name']) // charge juste le nom
        })
        .orderBy('date_rdv', 'desc')

      const formatted = appointments.map((appointment) => ({
        id: appointment.id,
        patientName: appointment.patient?.username ?? 'Inconnu',
        date: appointment.dateRdv.toISODate(), // ou .toFormat('dd/MM/yyyy') si tu veux
      }))

      return response.ok(formatted)
    } catch (error) {
      console.error('Erreur récupération appointments:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
