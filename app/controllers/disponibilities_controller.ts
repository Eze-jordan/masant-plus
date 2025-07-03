import Disponibilite from '#models/disponibilite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class DisponibiliteController {
  // ➤ Créer une disponibilité
  public async store({ request, response }: HttpContextContract) {
    const data = request.only([
      'idDoctor',
      'heureDebut',
      'heureFin',
      'date_debut',
      'date_fin',
      'actif',
    ])

    if (!data.idDoctor || !data.heureDebut || !data.heureFin) {
      return response.status(400).send({ message: 'idDoctor, heureDebut et heureFin sont obligatoires.' })
    }

    const dateDebut = data.date_debut ? DateTime.fromISO(data.date_debut) : null
    const dateFin = data.date_fin ? DateTime.fromISO(data.date_fin) : null

    if (dateDebut && !dateDebut.isValid) {
      return response.status(400).send({ message: 'La dateDebut est invalide.' })
    }
    if (dateFin && !dateFin.isValid) {
      return response.status(400).send({ message: 'La dateFin est invalide.' })
    }

    try {
      const disponibilite = await Disponibilite.create({
        idDoctor: data.idDoctor,
        heureDebut: data.heureDebut,
        heureFin: data.heureFin,
        dateDebut,
        dateFin,
        actif: data.actif ?? true,
      })

      return response.created(disponibilite)
    } catch (error:any) {
      console.error(error)
      return response.status(500).send({
        message: 'Erreur lors de la création de la disponibilité.',
        error: error.message,
      })
    }
  }

  // ➤ Récupérer toutes les disponibilités
  public async index({ response }: HttpContextContract) {
    try {
      const disponibilites = await Disponibilite.query()
        .preload('doctor')
        .preload('creneaux')
        .orderBy('createdAt', 'desc')

      return response.ok(disponibilites)
    } catch (error:any) {
      console.error(error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération des disponibilités.',
        error: error.message,
      })
    }
  }

  // ➤ Récupérer une disponibilité par ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)
      return response.ok(disponibilite)
    } catch (error) {
      console.error(error)
      return response.status(404).send({ message: 'Disponibilité non trouvée.' })
    }
  }

  // ➤ Mettre à jour une disponibilité
  public async update({ params, request, response }: HttpContextContract) {
    const data = request.only([
      'idDoctor',
      'heureDebut',
      'heureFin',
      'date_debut',
      'date_fin',
      'actif',
    ])

    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)

      disponibilite.idDoctor = data.idDoctor ?? disponibilite.idDoctor
      disponibilite.heureDebut = data.heureDebut ?? disponibilite.heureDebut
      disponibilite.heureFin = data.heureFin ?? disponibilite.heureFin

      if (data.date_debut) {
        const parsed = DateTime.fromISO(data.date_debut)
        if (!parsed.isValid) {
          return response.badRequest({ message: 'dateDebut invalide' })
        }
        disponibilite.dateDebut = parsed
      }

      if (data.date_fin) {
        const parsed = DateTime.fromISO(data.date_fin)
        if (!parsed.isValid) {
          return response.badRequest({ message: 'dateFin invalide' })
        }
        disponibilite.dateFin = parsed
      }

      disponibilite.actif = data.actif ?? disponibilite.actif

      await disponibilite.save()
      return response.ok(disponibilite)
    } catch (error:any) {
      console.error(error)
      return response.status(404).send({
        message: 'Disponibilité non trouvée.',
        error: error.message,
      })
    }
  }

  // ➤ Supprimer une disponibilité
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)
      await disponibilite.delete()
      return response.ok({ message: 'Disponibilité supprimée avec succès.' })
    } catch (error:any) {
      console.error(error)
      return response.status(404).send({
        message: 'Disponibilité non trouvée.',
        error: error.message,
      })
    }
  }
}
