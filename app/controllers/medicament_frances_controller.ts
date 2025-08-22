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

public async index({ params, request, response }: HttpContextContract) {
  try {
    const nameParam = params.name
    const search = request.input('search')
    const queryStr = nameParam || search

    let medications = []

    if (queryStr) {
      // Recherche principale : médicaments dont le nom contient la query
      medications = await Medication
        .query()
        .whereNotNull('name')
        .whereILike('name', `%${queryStr}%`)
        .limit(10)

      // Si aucun résultat, on suggère un médicament proche (ex: premier médicament avec nom non null)
      if (medications.length === 0) {
        const suggestion = await Medication
          .query()
          .whereNotNull('name')
          .limit(1)
          .first()

        if (suggestion) {
          medications = [suggestion]
        }
      }
    } else {
      // Si pas de recherche, retourne les 10 premiers médicaments avec un nom non null
      medications = await Medication
        .query()
        .whereNotNull('name')
        .limit(10)
    }

    // Transformer tous les noms en lowercase, et s'assurer que ce n'est jamais null
    medications = medications.map(med => ({
      ...med,
      name: (med.name || '').toLowerCase(),
    }))

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
