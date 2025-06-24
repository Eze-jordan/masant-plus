// app/controllers/appointments_controller.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appointment from '#models/appointment'

export default class AppointmentsController {
  public async count({ params, response }: HttpContextContract) {
    try {
      const userId = params.userId

      const count = await Appointment.query()
        .where('id_user', userId) // ✅ ici c'est bien id_user
        .count('* as total')

      return response.ok({ count: count[0].$extras.total })
    } catch (error) {
      console.error('Erreur Appointment count:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
