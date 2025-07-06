import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, TypeRDV } from '../enum/enums.js'
import Appointment from '#models/appointment'
import { DateTime } from 'luxon'

export default class AppointmentController {
  /**
   * Créer un nouveau rendez-vous
   */
  public async create({ request, response }: HttpContextContract) {
    try {
      const payload = request.only([
        'idDoctor',
        'idPatient',
        'date',
        'typeRdv',
        'etatRdv',
        'description',
        'heureDebut', // Heure de début personnalisée par l'utilisateur
      ])

      // Vérification des champs obligatoires
      if (!payload.idDoctor || !payload.idPatient || !payload.date || !payload.typeRdv || !payload.etatRdv || !payload.heureDebut) {
        return response.badRequest({ message: 'Champs requis manquants.' })
      }

      // Validation des valeurs d'enum
      if (!Object.keys(TypeRDV).includes(payload.typeRdv)) {
        return response.badRequest({ message: `typeRdv invalide : ${payload.typeRdv}` })
      }

      if (!Object.keys(EtatRDV).includes(payload.etatRdv)) {
        return response.badRequest({ message: `etatRdv invalide : ${payload.etatRdv}` })
      }

      const dateRdv = DateTime.fromISO(payload.date)
      if (!dateRdv.isValid) {
        return response.badRequest({ message: 'Date invalide.' })
      }

      // On commence par vérifier si le créneau demandé est libre
      let heureDebut = DateTime.fromISO(`${payload.date}T${payload.heureDebut}`)
      if (!heureDebut.isValid) {
        return response.badRequest({ message: 'Heure de début invalide.' })
      }

      // Vérifier si un rendez-vous existe déjà à l'heure de début souhaitée
      let conflict = await this.checkAppointmentConflict(payload.idDoctor, dateRdv, heureDebut)
      
      // Si il y a un conflit (c'est-à-dire que l'heure est déjà occupée), on déplace l'heure de début par incréments de 30 minutes
      while (conflict) {
        heureDebut = heureDebut.plus({ minutes: 30 })  // Décalage de 30 minutes
        conflict = await this.checkAppointmentConflict(payload.idDoctor, dateRdv, heureDebut)
      }

      // Une fois qu'on a un créneau libre, calculer l'heure de fin
      const heureFin = heureDebut.plus({ minutes: 30 }) // Heure de fin = Heure de début + 30 minutes

      // Créer le rendez-vous
      const appointment = await Appointment.create({
        idDoctor: payload.idDoctor,
        idUser: payload.idPatient,
        dateRdv: dateRdv,
        typeRdv: payload.typeRdv,
        etatRdv: payload.etatRdv,
        heureDebut: heureDebut.toISO(), // Utilisation de l'heure de début calculée
        heureFin: heureFin.toISO(), // Utilisation de l'heure de fin calculée
      })

      return response.created(appointment)
    } catch (error) {
      console.error('[AppointmentController.create] Erreur :', error)
      return response.internalServerError({ message: 'Erreur serveur lors de la création du rendez-vous.' })
    }
  }

  /**
   * Vérifie si un rendez-vous existe déjà pour un médecin à une certaine date et heure
   */
  private async checkAppointmentConflict(idDoctor: string, dateRdv: DateTime, heureDebut: DateTime) {
    const heureFin = heureDebut.plus({ minutes: 30 }) // 30 minutes après l'heure de début

    const conflict = await Appointment.query()
      .where('idDoctor', idDoctor)
      .andWhere('dateRdv', dateRdv.toISODate()) // Vérifier la même date
      .whereRaw(`
        (heureDebut < ? AND heureFin > ?) OR
        (heureDebut < ? AND heureFin > ?)
      `, [heureFin.toISO(), heureDebut.toISO(), heureDebut.toISO(), heureFin.toISO()])

    return conflict.length > 0
  }
}
