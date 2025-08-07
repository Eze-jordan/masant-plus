import Disponibilite from '#models/disponibilite'
import Creneau from '#models/creneau'
import User from '#models/user'
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

  // ➤ Créer une disponibilité (sans créer les créneaux)
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()
    const { idDoctor, date_debut, date_fin, actif = true, jours, heureDebut, heureFin } = payload

    // Vérification des données requises
    if (!idDoctor || !date_debut || !jours || !Array.isArray(jours) || jours.length === 0) {
      return response.badRequest({ message: 'idDoctor, date_debut, jours (array) et heureDebut/heureFin sont requis.' })
    }

    try {
      // Vérification du médecin et de son rôle
      const user = await User.query().where('id', idDoctor).preload('role').firstOrFail()
      if (!user.role || user.role.label !== 'doctor') {
        return response.badRequest({ message: 'Le rôle doit être "Doctor"' })
      }

      // Validation des dates
      const dateDebut = DateTime.fromISO(date_debut)
      const dateFin = date_fin ? DateTime.fromISO(date_fin) : dateDebut

      if (!dateDebut.isValid || !dateFin.isValid) {
        return response.badRequest({ message: 'Dates invalides.' })
      }

      // Création de la disponibilité
      const disponibilite = await Disponibilite.create({
        idDoctor,
        dateDebut,
        dateFin,
        heureDebut: heureDebut || '',
        heureFin: heureFin || '',
        actif,
        jours, // Stockage des jours dans la disponibilité
      })

      // Création des créneaux pour chaque jour spécifié
  

      return response.created({
        message: 'Disponibilité et créneaux créés avec succès.',
        idDisponibilite: disponibilite.id
      })
    } catch (error: any) {
      console.error(error)
      return response.status(500).send({ message: error.message })
    }
  }

  // Fonction pour générer les créneaux horaires pour un jour donné
  public async generateCreneauxForDay({ params, request, response }: HttpContextContract) {
    const { dateDebut, dateFin } = request.only(['dateDebut', 'dateFin'])

    // Vérification des dates
    if (!dateDebut || !dateFin) {
      return response.badRequest({ message: 'dateDebut et dateFin sont requis.' })
    }

    try {
      // Récupérer la disponibilité existante par son ID
      const disponibilite = await Disponibilite.findOrFail(params.id)

      // Valider les dates
      const debut = DateTime.fromISO(dateDebut)
      const fin = DateTime.fromISO(dateFin)
      if (!debut.isValid || !fin.isValid || debut >= fin) {
        return response.badRequest({ message: 'Dates invalides.' })
      }

      // Mise à jour des dates de la disponibilité
      disponibilite.dateDebut = debut
      disponibilite.dateFin = fin
      await disponibilite.save()

      // Générer les créneaux pour la disponibilité mise à jour
      const creneaux = this.generateCreneaux(debut.toISO(), fin.toISO(), disponibilite.id)

      // Créer chaque créneau
      for (const creneau of creneaux) {
        await Creneau.create({
          idDisponibilite: creneau.idDisponibilite,
          heureDebut: creneau.heureDebut ?? '',
          heureFin: creneau.heureFin ?? '',
          disponible: creneau.disponible,
          isUsed: creneau.isUsed
        })
      }

      // Charger les créneaux associés à cette disponibilité
      await disponibilite.load('creneaux')

      return response.ok({
        message: 'Créneaux générés avec succès.',
        disponibilite,
        creneauxCount: creneaux.length,
      })
    } catch (error: any) {
      console.error(error)
      return response.status(500).send({ message: error.message })
    }
  }

  // ➤ Créer des créneaux pour une disponibilité existante
public async createCreneaux({ params, request, response }: HttpContextContract) {
  const { heureDebut, heureFin } = request.only(['heureDebut', 'heureFin']);

  // Vérification des horaires
  if (!heureDebut || !heureFin) {
    return response.badRequest({ message: 'heureDebut et heureFin sont requis.' });
  }

  try {
    // Récupérer la disponibilité existante par son ID
    const disponibilite = await Disponibilite.findOrFail(params.id);
    
    // Valider les horaires
    const { debut, fin, valid } = this.validateHeures(heureDebut, heureFin);
    if (!valid) {
      return response.badRequest({ message: 'Heures invalides.' });
    }

    // Générer les créneaux pour la disponibilité existante
    const creneaux = this.generateCreneaux(debut, fin, disponibilite.id);

    // Créer chaque créneau
    for (const creneau of creneaux) {
      await Creneau.create({
        idDisponibilite: disponibilite.id, // Utiliser l'ID de la disponibilité existante
        heureDebut: creneau.heureDebut ?? '',
        heureFin: creneau.heureFin ?? '',
        disponible: creneau.disponible,
        isUsed: creneau.isUsed,
        createdAt: creneau.createdAt ? DateTime.fromISO(creneau.createdAt) : DateTime.now(),
        updatedAt: creneau.updatedAt ? DateTime.fromISO(creneau.updatedAt) : DateTime.now(),
      });
    }

    // Charger les créneaux associés à cette disponibilité
    await disponibilite.load('creneaux');

    return response.ok({
      message: 'Créneaux créés avec succès.',
      disponibilite,
      creneauxCount: creneaux.length,
    });
  } catch (error: any) {
    if (error.code === 'E_ROW_NOT_FOUND') {
      return response.status(404).send({ message: 'Disponibilité introuvable.' });
    }
    console.error(error);
    return response.status(500).send({ message: error.message });
  }
}




  // Fonction pour valider les heures de début et de fin
  private validateHeures(heureDebut: string, heureFin: string) {
    const debut = DateTime.fromFormat(heureDebut, 'HH:mm')
    const fin = DateTime.fromFormat(heureFin, 'HH:mm')

    if (!debut.isValid || !fin.isValid || debut >= fin) {
      return { valid: false, debut: '', fin: '' }
    }

    return { valid: true, debut: debut.toFormat('HH:mm'), fin: fin.toFormat('HH:mm') }
  }

  // Fonction pour générer les créneaux horaires (pas de jours spécifiques, uniquement des créneaux horaires)
  private generateCreneaux(heureDebut: string, heureFin: string, idDisponibilite: string) {
    const creneaux = []
    let currentDate = DateTime.fromISO(heureDebut)
    const endDate = DateTime.fromISO(heureFin)

    // Générer les créneaux horaires entre heureDebut et heureFin
    while (currentDate < endDate) {
      creneaux.push({
        idDisponibilite,
        heureDebut: currentDate.toISO(),
        heureFin: currentDate.plus({ hour: 1 }).toISO(),
        disponible: true,
        isUsed: false,
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      })
      currentDate = currentDate.plus({ hour: 1 })
    }

    return creneaux
  }

  // ➤ Liste toutes les disponibilités avec relations pour un médecin donné
  public async getByDoctor({ params, response }: HttpContextContract) {
    try {
      const now = DateTime.local()

      const disponibilites = await Disponibilite.query()
        .where('idDoctor', params.id)
        .preload('creneaux', (query) => {
          query.where('is_used', false)
        })
        .preload('doctor', (doctorQuery) => {
          doctorQuery.select(['id', 'first_name', 'type'])
        })
        .orderBy('dateDebut', 'asc')

      const groupedByDate: Record<string, any> = {}

      for (const dispo of disponibilites) {
        if (!dispo.dateDebut) continue

        const dateDebut = dispo.dateDebut
        const dateKey = dateDebut.toISODate()
        if (!dateKey) continue

        const isToday = dateDebut.hasSame(now, 'day')
        const isFuture = dateDebut > now

        const creneaux = dispo.creneaux as unknown as Creneau[]

        let filteredCreneaux = creneaux

        if (isToday) {
          filteredCreneaux = creneaux.filter(c => {
            const [hour, minute] = c.heureDebut.split(':').map(Number)
            const creneauTime = dateDebut.set({ hour, minute })
            return creneauTime > now
          })
        } else if (!isFuture) {
          continue
        }

        if (filteredCreneaux.length === 0) continue

        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = {
            date_debut: dateKey,
            date_fin: dispo.dateFin?.toISODate() ?? null,
            idDoctor: dispo.idDoctor,
            doctor: dispo.doctor,
            actif: dispo.actif,
            creneaux: []
          }
        }

        groupedByDate[dateKey].creneaux.push(
          ...filteredCreneaux.map(c => ({
            id: c.id,
            heureDebut: c.heureDebut,
            heureFin: c.heureFin
          }))
        )
      }

      const result = Object.values(groupedByDate)
      return response.ok(result)

    } catch (error) {
      console.error(error)
      return response.status(500).send({
        message: 'Erreur serveur',
        error: error.message
      })
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

      if (typeof data.actif !== 'undefined') {
        disponibilite.actif = data.actif === true || data.actif === 'true'
      }

      await disponibilite.save()
      return response.ok({
        message: 'Disponibilité mise à jour avec succès',
        disponibilite,
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
