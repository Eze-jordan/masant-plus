// app/controllers/dashboard_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { Status } from '../enum/enums.js'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const totalPatients = await User.query().where('role', 'PATIENT').count('* as total')
    const activePatients = await User.query()
      .where('role', 'PATIENT')
      .where('status', Status.ACTIVE)
      .count('* as total')

    const total = totalPatients[0].$extras.total ?? 0
    const active = activePatients[0].$extras.total ?? 0
    const inactive = total - active
    const percentActive = total ? Math.round((active / total) * 100) : 0

    return inertia.render('Dashboard', {
      stats: {
        totalPatients: total,
        activePatients: active,
        inactivePatients: inactive,
        percentActive,
      },
    })
  }
}
