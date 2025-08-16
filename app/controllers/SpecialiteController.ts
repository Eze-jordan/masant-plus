import Specialite from '#models/specialite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SpecialiteController {
  public async create({ request, response }: HttpContextContract) {
    const data = request.only(['label', 'description', 'icon', 'color'])

    try {
      // Vérifier si le label existe déjà (insensible à la casse)
      const existing = await Specialite.query()
        .whereRaw('LOWER(label) = ?', [data.label.toLowerCase()])
        .first()

      if (existing) {
        return response.conflict({ message: 'Une spécialité avec ce label existe déjà.' })
      }

      const specialite = await Specialite.create(data)
      return response.created({ message: 'Spécialité créée', specialite })
    } catch (error) {
      return response.badRequest({ message: 'Erreur création spécialité', error: error.message })
    }
  }

  public async index({ response }: HttpContextContract) {
    const specialites = await Specialite.all()
    return response.ok(specialites)
  }
}
