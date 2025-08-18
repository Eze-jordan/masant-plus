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

  // ➤ Créer une nouvelle disponibilité
  public async store({ request, response }: HttpContextContract) {
    try {
      const {
        idDoctor,
        date_debut,
        date_fin,
        actif = true,
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

      const disponibilite = await Disponibilite.create({
        idDoctor,
        dateDebut,
        dateFin,
        actif,
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


  // ➤ Générer des créneaux pour une plage horaire et mettre à jour la disponibilité
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

      // Note : ici tu génères les créneaux sans date associée, peut-être à revoir selon usage
      const creneaux = this.generateCreneaux(debut.toFormat('HH:mm'), fin.toFormat('HH:mm'), disponibilite.id)

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

  // ➤ Créer des créneaux pour une disponibilité sur des jours donnés (heures 'HH:mm')
public async createCreneaux({ params, request, response }: HttpContextContract) {
  const { dates } = request.only(['dates'])

  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    return response.badRequest({ message: 'Le tableau dates est requis.' })
  }

  try {
    const disponibilite = await Disponibilite.findOrFail(params.id)

    if (!disponibilite.dateDebut || !disponibilite.dateFin) {
      return response.badRequest({ message: 'La disponibilité doit avoir une date de début et de fin.' })
    }

    const dateDebutISO = disponibilite.dateDebut.toISODate()!
    const dateFinISO = disponibilite.dateFin.toISODate()!

    let totalCreated = 0

    for (const jour of dates) {
      if (!jour.date || !jour.heureDebut || !jour.heureFin) {
        return response.badRequest({ message: 'Chaque objet doit contenir date, heureDebut et heureFin.' })
      }

      const dateISO = DateTime.fromISO(jour.date)
      if (!dateISO.isValid) {
        return response.badRequest({ message: `La date ${jour.date} est invalide.` })
      }

      if (dateISO < DateTime.fromISO(dateDebutISO) || dateISO > DateTime.fromISO(dateFinISO)) {
        return response.badRequest({ message: `La date ${jour.date} n'est pas dans la période de disponibilité.` })
      }

      const { debut, fin, valid } = this.validateHeures(jour.heureDebut, jour.heureFin)
      if (!valid) {
        return response.badRequest({ message: `Heures invalides pour la date ${jour.date}.` })
      }

      const jourSemaine = dateISO.setLocale('fr').toFormat('cccc')

      const creneaux = this.generateCreneaux(debut, fin, disponibilite.id, dateISO.toFormat('yyyy-MM-dd'))

      for (const creneau of creneaux) {
        const exists = await Creneau.query()
          .where('idDisponibilite', disponibilite.id)
          .where('heureDebut', creneau.heureDebut)
          .where('heureFin', creneau.heureFin)
          .where('date', dateISO.toFormat('yyyy-MM-dd'))
          .first()

        if (!exists) {
          await Creneau.create({
            idDisponibilite: disponibilite.id,
            heureDebut: creneau.heureDebut ?? '',
            heureFin: creneau.heureFin ?? '',
            disponible: creneau.disponible,
            isUsed: creneau.isUsed,
            date: dateISO.toFormat('yyyy-MM-dd'),
            jour: jourSemaine,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          })
          totalCreated++
        }
      }
    }

    await disponibilite.load('creneaux')

    return response.ok({
      message: `${totalCreated} créneaux créés avec succès.`,
      disponibilite,
      creneauxCount: totalCreated,
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

  // Génère des créneaux de 15 minutes entre debut et fin (format 'HH:mm') — ici la date est obligatoire
  generateCreneaux(debut: string, fin: string, idDisponibilite: string, date?: string) {
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
        date: date ?? '',  // date obligatoire idéalement toujours fournie côté appel
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      })

      start = next
    }

    return creneaux
  }

  // ➤ Liste toutes les disponibilités avec relations pour un médecin donné


public async getByDoctor({ params, response }: HttpContextContract) {
  try {
    // 🔍 1. Récupérer toutes les disponibilités du docteur avec créneaux non utilisés
    const disponibilites = await Disponibilite.query()
      .where('idDoctor', params.id)
      .preload('creneaux', (query) => {
        query.where('isUsed', false)  // Nous filtrons les créneaux non utilisés
      })
      .preload('doctor', (doctorQuery) => {
        doctorQuery.select(['id', 'first_name', 'type'])  // On charge certaines infos du médecin
      })
      .orderBy('dateDebut', 'asc')  // Tri par date de début

    const groupedByDate: Record<string, any> = {}

    // 📦 2. Regrouper les disponibilités par date
    for (const dispo of disponibilites) {
      if (!dispo.dateDebut) continue

      const dateKey = dispo.dateDebut.toISODate()
      if (!dateKey) continue

      const creneaux = dispo.creneaux as Creneau[]
      if (creneaux.length === 0) continue

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date_debut: dateKey,
          date_fin: dispo.dateFin?.toISODate() ?? null,
          idDoctor: dispo.idDoctor,
          doctor: dispo.doctor,
          actif: dispo.actif,
          creneaux: [],
        }
      }

      // 🔄 3. Ajouter les créneaux, incluant `isUsed`, et le formatage du jour
      groupedByDate[dateKey].creneaux.push(
        ...creneaux.map(c => {
          const jour = DateTime.fromISO(c.date).setLocale('fr').toFormat('cccc')
          return {
            id: c.id,
            heureDebut: c.heureDebut,
            heureFin: c.heureFin,
            date: c.date,
            jour,
            isUsed: c.isUsed,  // On ajoute `isUsed` dans le retour
          }
        })
      )
    }

    // ✅ 4. Retourner les données groupées
    return response.ok(Object.values(groupedByDate))
  } catch (error) {
    console.error('Erreur dans getByDoctor:', error)
    return response.status(500).send({
      message: 'Erreur serveur',
      error: error.message,
    })
  }
}


  // ➤ Détails d'une disponibilité
  public async show({ params, response }: HttpContextContract) {
    try {
      const disponibilite = await Disponibilite.query()
        .where('id', params.id)
        .select(['id', 'date_debut', 'date_fin', 'created_at']) // champs que tu veux
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
      'date_debut',
      'date_fin',
      'actif',
    ])

    try {
      const disponibilite = await Disponibilite.findOrFail(params.id)

      disponibilite.idDoctor = data.idDoctor ?? disponibilite.idDoctor

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
