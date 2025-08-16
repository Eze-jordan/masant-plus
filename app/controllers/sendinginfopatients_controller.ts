import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SendinginfopatientsController {
  // Lister tous les patients
  public async index({ response }: HttpContextContract) {
    try {
      const patients = await User.query().where('type', 'patient')
      return response.ok(patients)
    } catch (error) {
      return response.status(500).send({ message: 'Erreur serveur', error: error.message })
    }
  }

  // Afficher un patient par id
  public async show({ params, response }: HttpContextContract) {
    try {
      const patient = await User.query()
        .where('id', params.id)
        .where('type', 'patient')
        .firstOrFail()
      return response.ok(patient)
    } catch (error) {
      return response.status(404).send({ message: 'Patient non trouvé' })
    }
  }

  // Créer un nouveau patient
  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'phone',
        'dateNaissance',
        'groupeSanguin',
        'poids',
        'address',
        // ajouter d’autres champs pertinents
      ])

      data.type = 'patient' // forcer type patient

      const patient = await User.create(data)
      return response.created(patient)
    } catch (error) {
      return response.status(400).send({ message: 'Erreur création patient', error: error.message })
    }
  }

  // Mettre à jour un patient
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const patient = await User.query()
        .where('id', params.id)
        .where('type', 'patient')
        .firstOrFail()

      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'phone',
        'dateNaissance',
        'groupeSanguin',
        'poids',
        'address',
        // autres champs possibles
      ])

      patient.merge(data)
      await patient.save()

      return response.ok(patient)
    } catch (error) {
      return response.status(404).send({ message: 'Patient non trouvé ou erreur', error: error.message })
    }
  }

  // Supprimer un patient
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const patient = await User.query()
        .where('id', params.id)
        .where('type', 'patient')
        .firstOrFail()

      await patient.delete()
      return response.noContent()
    } catch (error) {
      return response.status(404).send({ message: 'Patient non trouvé' })
    }
  }
}
