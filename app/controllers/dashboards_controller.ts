import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '#models/user'
import Paiement from '#models/paiement'

export default class DashboardsController {
  public async index({ inertia, auth }: HttpContextContract) {
    await auth.check()
    if (!auth.user) {
      return inertia.render('errors/unauthorized')
    }

    const currentUser = auth.user

    // Patients
    const totalPatients = await User.query().where('type', 'patient').count('* as total')
    const activePatients = await User.query().where('type', 'patient').where('is_active', true).count('* as total')

    // Doctors
    const totalDoctors = await User.query().where('type', 'doctor').count('* as total')
    const activeDoctors = await User.query().where('type', 'doctor').where('is_active', true).count('* as total')

    // Montant total plateforme
    const sumResult = await Paiement.query().sum('montant as total')
    const montantTotalPlateforme = sumResult[0].$extras.total || 0

    // Stats calculées
    const stats = {
      totalPatients: Number(totalPatients[0].$extras.total),
      activePatients: Number(activePatients[0].$extras.total),
      inactivePatients: Number(totalPatients[0].$extras.total) - Number(activePatients[0].$extras.total),
      percentActivePatients:
        Number(totalPatients[0].$extras.total) > 0
          ? (Number(activePatients[0].$extras.total) / Number(totalPatients[0].$extras.total)) * 100
          : 0,

      totalDoctors: Number(totalDoctors[0].$extras.total),
      activeDoctors: Number(activeDoctors[0].$extras.total),
      inactiveDoctors: Number(totalDoctors[0].$extras.total) - Number(activeDoctors[0].$extras.total),
      percentActiveDoctors:
        Number(totalDoctors[0].$extras.total) > 0
          ? (Number(activeDoctors[0].$extras.total) / Number(totalDoctors[0].$extras.total)) * 100
          : 0,

      montantTotalPlateforme
    }

    // Liste des utilisateurs (sans infos sensibles)
    const users = await User.query().select('id', 'first_name', 'last_name', 'email', 'type', 'is_active')

    return inertia.render('dashboard/dashboard', {
      user: {
        id: currentUser.id,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        email: currentUser.email
      },
      users,
      stats
    })
  }
}
