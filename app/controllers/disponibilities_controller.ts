import Disponibilite from '#models/disponibilite'
import Creneau from '#models/creneau'
import User from '#models/user'  // Assure-toi que cet import est correct
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

export default class DisponibiliteController {
  // ➤ Retourne toutes les disponibilités pour tous les médecins
  public async index({ response }: HttpContextContract) {
    try {
      const disponibilites = await Disponibilite.query()
        .preload('creneaux')
        .preload('doctor')
        .orderBy('dateDebut', 'desc')

      return response.ok(disponibilites)
    } catch (error) {
      console.error('Erreur dans index :', error)
      return response.status(500).send({
        message: 'Erreur lors de la récupération des disponibilités.',
        error: error.message,
      })
    }
  }

  // ➤ Créer une disponibilité avec créneaux générés automatiquement
// ➤ Créer une disponibilité avec créneaux générés automatiquement
public async store({ request, response }: HttpContextContract) {
  const data = request.only([
    'idDoctor',
    'heureDebut',
    'heureFin',
    'date_debut',
    'date_fin',
    'actif',
  ])

  if (!data.idDoctor) {
    return response.status(400).send({
      message: 'idDoctor est obligatoire.',
    })
  }

  try {
    // Vérifier que l'utilisateur a bien le rôle doctor
    const user = await User.query()
      .where('id', data.idDoctor)
      .preload('role')
      .firstOrFail()

    if (!user.role || user.role.label !== 'doctor') {
      return response.status(403).send({
        message: 'L\'utilisateur n\'a pas le rôle "Doctor".',
      })
    }

    if (!data.heureDebut || !data.heureFin) {
      return response.status(400).send({
        message: 'heureDebut et heureFin sont obligatoires.',
      })
    }

    const dateDebut = data.date_debut ? DateTime.fromISO(data.date_debut) : null
    const dateFin = data.date_fin ? DateTime.fromISO(data.date_fin) : null

    if (dateDebut && !dateDebut.isValid) {
      return response.badRequest({ message: 'La date_debut est invalide.' })
    }
    if (dateFin && !dateFin.isValid) {
      return response.badRequest({ message: 'La date_fin est invalide.' })
    }

    // Créer la disponibilité
    const disponibilite = await Disponibilite.create({
      idDoctor: data.idDoctor,
      heureDebut: data.heureDebut,  // selon ton modèle
      heureFin: data.heureFin,
      dateDebut,
      dateFin,
      actif: data.actif ?? true,
    })

    // Générer les créneaux en snake_case pour la BDD
    const allCreneaux = []

    const heureDebut = DateTime.fromFormat(data.heureDebut, 'HH:mm')
    const heureFin = DateTime.fromFormat(data.heureFin, 'HH:mm')

    if (!heureDebut.isValid || !heureFin.isValid) {
      return response.badRequest({ message: 'Format des heures invalide.' })
    }

    const start = dateDebut ?? DateTime.now()
    const end = dateFin ?? start

    for (let day = start; day <= end; day = day.plus({ days: 1 })) {
      let current = heureDebut
      while (current < heureFin) {
        const next = current.plus({ minutes: 30 })

        allCreneaux.push({
          id_disponibilite: disponibilite.id, // correct
          heure_debut: current.toFormat('HH:mm'),
          heure_fin: next.toFormat('HH:mm'),
          disponible: true,
        })
        

        current = next
      }
    }

    // Insérer tous les créneaux d’un coup
    await Creneau.createMany(allCreneaux)

    // Précharger relations avant de renvoyer
    await disponibilite.load('creneaux')
    await disponibilite.load('doctor')

    return response.created(disponibilite)
  } catch (error: any) {
    console.error(error)
    return response.status(500).send({
      message: 'Erreur lors de la création de la disponibilité.',
      error: error.message,
    })
  }
}

   

  // ➤ Liste toutes les disponibilités avec relations pour un médecin donné
  public async getByDoctor({ params, response }: HttpContextContract) {
    try {
      const disponibilites = await Disponibilite.query()
        .where('idDoctor', params.id)
        .preload('creneaux')
        .orderBy('dateDebut', 'desc')
      return response.ok(disponibilites)
    } catch (error) {
      return response.status(500).send({ message: 'Erreur serveur', error: error.message })
    }
  }

  // ➤ Détails d'une disponibilité
  public async show({ params, response }: HttpContextContract) {
    try {
      const disponibilite = await Disponibilite.query()
        .where('id', params.id)
        .preload('creneaux')
        .preload('doctor')
        .firstOrFail()

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
          return response.badRequest({ message: 'date_debut invalide' })
        }
        disponibilite.dateDebut = parsed
      }

      if (data.date_fin) {
        const parsed = DateTime.fromISO(data.date_fin)
        if (!parsed.isValid) {
          return response.badRequest({ message: 'date_fin invalide' })
        }
        disponibilite.dateFin = parsed
      }

      // IMPORTANT : vérifie que "actif" est bien défini dans la requête
      if (typeof data.actif !== 'undefined') {
        disponibilite.actif = data.actif
      }

      await disponibilite.save()
      return response.ok({
        message: 'Disponibilité mise à jour avec succès',
        disponibilite, // retourne aussi l'objet mis à jour
      })
      
    } catch (error: any) {
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
    } catch (error: any) {
      console.error(error)
      return response.status(404).send({
        message: 'Disponibilité non trouvée.',
        error: error.message,
      })
    }
  }
}
