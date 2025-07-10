import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PatientController {
  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    try {
      const patient = await User.query()
        .where('id', id)
        .firstOrFail()

      console.log('Patient found:', patient)

      return response.ok({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
      })
    } catch (error) {
      console.log('Patient not found with id:', id)
      return response.status(404).json({ message: 'Patient not found' })
    }
  }
}
