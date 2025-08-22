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
    const { doctorId } = params

    if (!doctorId) {
      return response.badRequest({ message: 'ID docteur requis' })
    }

    const {
      idAppointment,
      label,
      duration,
      dosage,
      medications,
      instructions,
    } = request.only([
      'idAppointment',
      'label',
      'duration',
      'dosage',
      'medications',
      'instructions',
    ])

    try {
      const appointment = await Appointment.find(idAppointment)

      if (!appointment) {
        return response.notFound({ message: 'Rendez-vous introuvable' })
      }

      if (appointment.idDoctor !== doctorId) {
        return response.unauthorized({ message: "Le rendez-vous n'appartient pas à ce docteur" })
      }

      const prescription = await Prescription.create({
        idAppointment,
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
