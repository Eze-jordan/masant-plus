import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'

export default class AppointmentController {
  public async getAppointmentsForDoctor({ request, response }: HttpContextContract) {
    try {
      const idDoctor = request.input('idDoctor')
      if (!idDoctor) {
        return response.badRequest({ message: 'idDoctor est requis' })
      }

      // On récupère les filtres optionnels depuis la query string
      const filterType = request.input('typeRdv') as keyof typeof TypeRDV | undefined
      const filterEtat = request.input('etatRdv') as keyof typeof EtatRDV | undefined

      // Valider les filtres si fournis
      if (filterType && !Object.keys(TypeRDV).includes(filterType)) {
        return response.badRequest({ message: `typeRdv invalide: ${filterType}` })
      }
      if (filterEtat && !Object.keys(EtatRDV).includes(filterEtat)) {
        return response.badRequest({ message: `etatRdv invalide: ${filterEtat}` })
      }

      const query = Appointment.query().where('idDoctor', idDoctor)

      if (filterType) {
        query.andWhere('typeRdv', filterType)
      }
      if (filterEtat) {
        query.andWhere('etatRdv', filterEtat)
      }

      const appointments = await query
        .preload('patient')
        .preload('paiements')
        .preload('prescription')
        .preload('review')

      return response.ok(appointments)
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Erreur serveur' })
    }
  }
}
