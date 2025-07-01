import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Disponibilite from '#models/disponibilite'

export default class DisponibilitesController {
  // 🔁 GET /disponibilites/:idDoctor
  public async getDisponibilites({ params, response }: HttpContextContract) {
    const { idDoctor } = params

    try {
      const disponibilites = await Disponibilite
        .query()
        .where('id_doctor', idDoctor)
        .where('actif', true)

      const groupedByDay: Record<string, string[]> = {}

      for (const d of disponibilites) {
        const heure = `${d.heureDebut}-${d.heureFin}`
        if (!groupedByDay[d.jour]) groupedByDay[d.jour] = []
        groupedByDay[d.jour].push(heure)
      }

      const result = Object.entries(groupedByDay).map(([day, slots]) => ({
        day,
        slots,
      }))

      return response.ok(result)
    } catch (error) {
      console.error('Erreur récupération disponibilités:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }

  // 📝 POST /disponibilites/:idDoctor
  public async setDisponibilites({ params, request, response }: HttpContextContract) {
    const { idDoctor } = params
    const disponibilites = request.body() // [{ day: string, slots: string[] }]

    if (!Array.isArray(disponibilites)) {
      return response.status(400).json({ message: 'Format invalide' })
    }

    try {
      // Supprimer les anciennes disponibilités actives
      await Disponibilite.query().where('id_doctor', idDoctor).delete()

      // Créer les nouvelles
      for (const { day, slots } of disponibilites) {
        for (const slot of slots) {
          const [heureDebut, heureFin] = slot.split('-')

          await Disponibilite.create({
            idDoctor,
            jour: day,
            heureDebut,
            heureFin,
            actif: true,
          })
        }
      }

      return response.ok({ message: 'Disponibilités enregistrées' })
    } catch (error) {
      console.error('Erreur enregistrement disponibilités:', error)
      return response.status(500).json({ message: 'Erreur serveur' })
    }
  }
}
