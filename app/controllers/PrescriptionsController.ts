import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appointment from '../models/appointment.js'
import Prescription from '../models/prescription.js'


export default class PrescriptionsController {
  /**
   * Liste toutes les prescriptions du patient via params.patientId
   */
  public async index({ params, response }: HttpContextContract) {
    const { patientId } = params

    if (!patientId) {
      return response.badRequest({ message: 'ID patient requis' })
    }

    try {
      const appointments = await Appointment
        .query()
        .where('userId', patientId)
        .preload('prescription')

      if (appointments.length === 0) {
        return response.notFound({ message: 'Aucun rendez-vous trouvé pour ce patient' })
      }

      const allPrescriptions = appointments.flatMap(
        (appointment) => appointment.prescription
      )

      return response.ok(allPrescriptions)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Erreur lors de la récupération des prescriptions' })
    }
  }

  /**
   * Création d'une prescription via params.doctorId
   * Vérifie que l'appointment appartient bien au docteur
   */
public async store({ params, request, response }: HttpContextContract) {
  const { doctorId, patientId } = params

  if (!doctorId || !patientId) {
    return response.badRequest({ message: 'ID docteur et ID patient requis' })
  }

  const {
    label,
    duration,
    dosage,
    medications,
    instructions,
  } = request.only([
    'label',
    'duration',
    'dosage',
    'medications',
    'instructions',
  ])

  try {
    // On récupère le dernier rendez-vous du docteur avec ce patient
    const appointment = await Appointment.query()
      .where('idDoctor', doctorId)
      .andWhere('idPatient', patientId)
      .orderBy('date', 'desc') // supposons que la colonne date existe
      .first()

    if (!appointment) {
      return response.notFound({ message: 'Aucun rendez-vous trouvé pour ce patient' })
    }

    const prescription = await Prescription.create({
      idAppointment: appointment.id,
      label,
      duration,
      dosage,
      medications,
      instructions,
    })

    return response.created(prescription)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ message: 'Erreur lors de la création de la prescription' })
  }
}

}
