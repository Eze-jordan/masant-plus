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

  // ➤ Créer une disponibilité avec créneaux générés automatiquement
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()
    const entries = Array.isArray(payload) ? payload : [payload]
    const results = []
    const erreurs: any[] = []
  
    for (const entry of entries) {
      const { idDoctor, date_debut, date_fin, creneaux, actif = true } = entry
  
      if (!idDoctor || !date_debut || !Array.isArray(creneaux) || creneaux.length === 0) {
        erreurs.push({
          entry,
          message: 'idDoctor, date_debut et au moins un créneau sont requis.'
        })
        continue
      }
  
      try {
        const user = await User.query().where('id', idDoctor).preload('role').firstOrFail()
        if (!user.role || user.role.label !== 'doctor') {
          erreurs.push({ entry, message: 'Le rôle doit être "Doctor"' })
          continue
        }
  
        const dateDebut = DateTime.fromISO(date_debut)
        const dateFin = date_fin ? DateTime.fromISO(date_fin) : dateDebut
  
        if (!dateDebut.isValid || !dateFin.isValid) {
          erreurs.push({ entry, message: 'Dates invalides.' })
          continue
        }
  
        // ➤ Une disponibilité pour chaque créneau
        for (const { heureDebut, heureFin } of creneaux) {
          const { debut, fin, valid } = this.validateHeures(heureDebut, heureFin)
  
          if (!valid) {
            erreurs.push({ entry, message: `Heure invalide : ${heureDebut} - ${heureFin}` })
            continue
          }
  
          const disponibilite = await Disponibilite.create({
            idDoctor,
            heureDebut: debut,
            heureFin: fin,
            dateDebut,
            dateFin,
            actif
          })
  
          const generated = this.generateCreneaux(debut, fin, dateDebut, dateFin, disponibilite.id)
          for (const creneau of generated) {
            await Creneau.create(creneau)
          }
  
          await disponibilite.load('creneaux')
          await disponibilite.load('doctor')
          results.push(disponibilite)
        }
  
      } catch (error: any) {
        console.error('Erreur lors de la création :', error)
        erreurs.push({ entry, message: error.message })
      }
    }
  
    return response.created({
      message: 'Disponibilités traitées.',
      total: results.length,
      erreurs: erreurs.length > 0 ? erreurs : undefined,
      data: Array.isArray(payload) ? results : results[0]
    })
  }
  
  
  
  
  

  // ➤ Liste toutes les disponibilités avec relations pour un médecin donné


  public async getByDoctor({ params, response }: HttpContextContract) {
    try {
      const now = DateTime.local()

      const disponibilites = await Disponibilite.query()
        .where('idDoctor', params.id)
        .preload('creneaux')
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

        // ✅ Cast explicite : dire à TS que c’est bien un tableau
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

      // Vérification de l'attribut 'actif'
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

  // Fonction pour générer les créneaux en fonction des heures exactes
  private generateCreneaux(
    heureDebut: string,
    heureFin: string,
    dateDebut: DateTime | null,
    dateFin: DateTime | null,
    idDisponibilite: string
  ) {
    const allCreneaux = []
    const start = dateDebut ?? DateTime.now()
    const end = dateFin ?? start.plus({ years: 1 }) // Un an de créneaux

    const debut = DateTime.fromFormat(heureDebut, 'HH:mm')
    const fin = DateTime.fromFormat(heureFin, 'HH:mm')

    if (!debut.isValid || !fin.isValid) {
      throw new Error('Format des heures invalide.')
    }

    // Créer un créneau pour chaque jour entre start et end
    for (let day = start; day <= end; day = day.plus({ days: 1 })) {
      allCreneaux.push({
        id_disponibilite: idDisponibilite,
        heure_debut: debut.toFormat('HH:mm'),
        heure_fin: fin.toFormat('HH:mm'),
        disponible: true,
      })
    }

    return allCreneaux
  }

  // Fonction pour valider les heures
  private validateHeures(heureDebut: string, heureFin: string) {
    const debut = DateTime.fromFormat(heureDebut, 'HH:mm')
    const fin = DateTime.fromFormat(heureFin, 'HH:mm')

    if (!debut.isValid || !fin.isValid || debut >= fin) {
      return { valid: false, debut: '', fin: '' }
    }

    return { valid: true, debut: debut.toFormat('HH:mm'), fin: fin.toFormat('HH:mm') }
  }
}
