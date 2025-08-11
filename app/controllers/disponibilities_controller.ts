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

  public async store({ request, response }: HttpContextContract) {
    try {
      const {
        idDoctor,
        date_debut,
        date_fin,
        actif = true,
        jours,
        heureDebut,
        heureFin
      } = request.body()

      if (!idDoctor || !date_debut) {
        return response.badRequest({
          message: 'idDoctor et date_debut sont requis.'
        })
      }

      const user = await User.query().where('id', idDoctor).preload('role').firstOrFail()
      if (!user.role || user.role.label.toLowerCase() !== 'doctor') {
        return response.badRequest({ message: 'Le rôle doit être "Doctor".' })
      }

      const dateDebut = DateTime.fromISO(date_debut)
      const dateFin = date_fin ? DateTime.fromISO(date_fin) : dateDebut

      if (!dateDebut.isValid || !dateFin.isValid) {
        return response.badRequest({ message: 'Dates invalides.' })
      }

      if (heureDebut || heureFin) {
        const heureDebutValid = DateTime.fromFormat(heureDebut || '', 'HH:mm')
        const heureFinValid = DateTime.fromFormat(heureFin || '', 'HH:mm')

        if (
          !heureDebutValid.isValid ||
          !heureFinValid.isValid ||
          heureDebutValid >= heureFinValid
        ) {
          return response.badRequest({ message: 'Heures invalides ou incohérentes.' })
        }
      }

      const joursJson = Array.isArray(jours) ? JSON.stringify(jours) : jours ?? '[]'

      const disponibilite = await Disponibilite.create({
        idDoctor,
        dateDebut,
        dateFin,
        actif,
        jours: joursJson,
        heureDebut: heureDebut || null,
        heureFin: heureFin || null
      })

      return response.created({
        message: 'Disponibilité créée avec succès.',
        idDisponibilite: disponibilite.id
      })

    } catch (error: any) {
      console.error('Erreur lors de la création de la disponibilité :', error)
      return response.status(500).send({
        message: 'Erreur serveur lors de la création de la disponibilité.',
        error: error.message
      })
    }
  }

  // ➤ Générer les créneaux pour un jour donné et mettre à jour la disponibilité
  public async generateCreneauxForDay({ params, request, response }: HttpContextContract) {
    const { dateDebut, dateFin } = request.only(['dateDebut', 'dateFin'])

    if (!dateDebut || !dateFin) {
      return response.badRequest({ message: 'dateDebut et dateFin sont requis.' })
    }

    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)

      const debut = DateTime.fromISO(dateDebut)
      const fin = DateTime.fromISO(dateFin)
      if (!debut.isValid || !fin.isValid || debut >= fin) {
        return response.badRequest({ message: 'Dates invalides.' })
      }

      disponibilite.dateDebut = debut
      disponibilite.dateFin = fin
      await disponibilite.save()

      const creneaux = this.generateCreneaux(debut.toFormat('HH:mm'), fin.toFormat('HH:mm'), disponibilite.id)

      // Création des créneaux en évitant les doublons
      for (const creneau of creneaux) {
        const exists = await Creneau.query()
          .where('idDisponibilite', disponibilite.id)
          .where('heureDebut', creneau.heureDebut)
          .where('heureFin', creneau.heureFin)
          .first()

        if (!exists) {
          await Creneau.create({
            ...creneau,
            createdAt: DateTime.fromISO(creneau.createdAt),
            updatedAt: DateTime.fromISO(creneau.updatedAt),
          })
        }
      }

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

  // ➤ Créer des créneaux pour une disponibilité existante (heures en 'HH:mm')
  public async createCreneaux({ params, request, response }: HttpContextContract) {
    const { heureDebut, heureFin } = request.only(['heureDebut', 'heureFin'])

    if (!heureDebut || !heureFin) {
      return response.badRequest({ message: 'heureDebut et heureFin sont requis.' })
    }

    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)

      const { debut, fin, valid } = this.validateHeures(heureDebut, heureFin)
      if (!valid) {
        return response.badRequest({ message: 'Heures invalides.' })
      }

      const creneaux = this.generateCreneaux(debut, fin, disponibilite.id)

      for (const creneau of creneaux) {
        const exists = await Creneau.query()
          .where('idDisponibilite', disponibilite.id)
          .where('heureDebut', creneau.heureDebut)
          .where('heureFin', creneau.heureFin)
          .first()

        if (!exists) {
          await Creneau.create({
            idDisponibilite: disponibilite.id,
            heureDebut: creneau.heureDebut ?? '',
            heureFin: creneau.heureFin ?? '',
            disponible: creneau.disponible,
            isUsed: creneau.isUsed,
            createdAt: creneau.createdAt ? DateTime.fromISO(creneau.createdAt) : DateTime.now(),
            updatedAt: creneau.updatedAt ? DateTime.fromISO(creneau.updatedAt) : DateTime.now(),
          })
        }
      }

      await disponibilite.load('creneaux')

      return response.ok({
        message: 'Créneaux créés avec succès.',
        disponibilite,
        creneauxCount: creneaux.length,
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).send({ message: 'Disponibilité introuvable.' })
      }
      console.error(error)
      return response.status(500).send({ message: error.message })
    }
  }

  // Validation des heures au format 'HH:mm'
  private validateHeures(heureDebut: string, heureFin: string) {
    const debut = DateTime.fromFormat(heureDebut, 'HH:mm')
    const fin = DateTime.fromFormat(heureFin, 'HH:mm')

    if (!debut.isValid || !fin.isValid || debut >= fin) {
      return { valid: false, debut: '', fin: '' }
    }

    return { valid: true, debut: debut.toFormat('HH:mm'), fin: fin.toFormat('HH:mm') }
  }

  // Génère des créneaux de 15 minutes entre debut et fin (format 'HH:mm')
  generateCreneaux(debut: string, fin: string, idDisponibilite: string) {
    const creneaux = []

    let start = DateTime.fromFormat(debut, 'HH:mm')
    const end = DateTime.fromFormat(fin, 'HH:mm')

    if (!start.isValid || !end.isValid || start >= end) {
      return []
    }

    while (start.plus({ minutes: 15 }) <= end) {
      const next = start.plus({ minutes: 15 })

      creneaux.push({
        idDisponibilite,
        heureDebut: start.toFormat('HH:mm'),
        heureFin: next.toFormat('HH:mm'),
        disponible: true,
        isUsed: false,
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      })

      start = next
    }

    return creneaux
  }

  // ... (le reste de tes méthodes inchangées : getByDoctor, show, update, destroy)

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

      if (typeof data.actif === 'boolean') {
        disponibilite.actif = data.actif
      }

      await disponibilite.save()
      return response.ok(disponibilite)
    } catch (error: any) {
      console.error(error)
      return response.status(404).send({ message: 'Disponibilité non trouvée.' })
    }
  }

  // ➤ Supprimer une disponibilité
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)
      await disponibilite.delete()
      return response.ok({ message: 'Disponibilité supprimée avec succès.' })
    } catch (error) {
      console.error(error)
      return response.status(404).send({ message: 'Disponibilité non trouvée.' })
    }
  }
}
