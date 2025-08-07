import Medication from '#models/medication'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MedicationsController {
  /**
   * Create a new medication
   */
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'name',
        'dci',
        'form',
        'dosage',
        'route',
        'indications',
        'contraindications',
        'sideEffects',
        'laboratory',
      ])

      const medication = await Medication.create(data)

      return response.created({
        message: 'Médicament créé avec succès',
        data: medication,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Une erreur est survenue lors de la création du médicament',
        error: error.message,
      })
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const medications = await Medication.all()
      return response.ok(medications)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des médicaments',
        error: error.message,
      })
    }
  }
  
}