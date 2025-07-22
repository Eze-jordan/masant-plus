import Specialite from '#models/specialite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SpecialiteController {
  public async create({ request, response }: HttpContextContract) {
    const data = request.only(['label', 'description', 'icon', 'color'])

    try {
      const specialite = await Specialite.create(data)
      return response.created({ message: 'Spécialité créée', specialite })
    } catch (error) {
      return response.badRequest({ message: 'Erreur création spécialité', error: error.message })
    }
  }

  // Optionnel : liste toutes les spécialités
  public async index({ response }: HttpContextContract) {
    const specialites = await Specialite.all()
    return response.ok(specialites)
  }
}
