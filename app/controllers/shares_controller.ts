// app/controllers/share_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Share from '#models/shares'

export default class SharesController {
  /**
   * Liste tous les partages
   */
  async index({ response }: HttpContext) {
    try {
      const shares = await Share.query()
        .preload('doctor')
        .preload('patient')
        .orderBy('created_at', 'desc')

      return response.ok(shares)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des partages',
        error: error.message,
      })
    }
  }

  /**
   * Crée un nouveau partage
   */
  async store({ request, response }: HttpContext) {
    try {
      const { doctorId, patientId, link } = request.only(['doctorId', 'patientId', 'link'])

      // Vérifier si le docteur existe et est bien un docteur
      const doctor = await User.findOrFail(doctorId)
      if (doctor.type !== 'doctor') {
        return response.badRequest({
          message: "L'utilisateur spécifié n'est pas un docteur",
        })
      }

      // Vérifier si le patient existe et est bien un patient
      const patient = await User.findOrFail(patientId)
      if (patient.type !== 'patient') {
        return response.badRequest({
          message: "L'utilisateur spécifié n'est pas un patient",
        })
      }

      // Vérifier si un partage existe déjà
      const existingShare = await Share.query()
        .where('doctor_id', doctorId)
        .where('patient_id', patientId)
        .first()

      if (existingShare) {
        return response.conflict({
          message: 'Un partage existe déjà entre ce docteur et ce patient',
          share: existingShare,
        })
      }

      const share = await Share.create({
        doctorId,
        patientId,
        link,
      })

      // Charger les relations
      await share.load('doctor')
      await share.load('patient')

      return response.created(share)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Docteur ou patient non trouvé',
        })
      }
      return response.internalServerError({
        message: 'Erreur lors de la création du partage',
        error: error.message,
      })
    }
  }

  /**
   * Affiche un partage spécifique
   */
  async show({ params, response }: HttpContext) {
    try {
      const share = await Share.query()
        .where('id', params.id)
        .preload('doctor')
        .preload('patient')
        .firstOrFail()

      return response.ok(share)
    } catch (error) {
      return response.notFound({
        message: 'Partage non trouvé',
      })
    }
  }

  /**
   * Met à jour un partage
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const share = await Share.findOrFail(params.id)
      const data = request.only(['link'])

      share.merge(data)
      await share.save()

      // Recharger les relations
      await share.load('doctor')
      await share.load('patient')

      return response.ok(share)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Partage non trouvé',
        })
      }
      return response.internalServerError({
        message: 'Erreur lors de la mise à jour du partage',
        error: error.message,
      })
    }
  }

  /**
   * Supprime un partage
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const share = await Share.findOrFail(params.id)
      await share.delete()

      return response.noContent()
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Partage non trouvé',
        })
      }
      return response.internalServerError({
        message: 'Erreur lors de la suppression du partage',
        error: error.message,
      })
    }
  }

  /**
   * Récupère les partages d'un docteur
   */
  async byDoctor({ params, response }: HttpContext) {
    try {
      const shares = await Share.query()
        .where('doctor_id', params.doctorId)
        .preload('doctor')
        .preload('patient')
        .orderBy('created_at', 'desc')

      return response.ok(shares)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des partages du docteur',
        error: error.message,
      })
    }
  }

  /**
   * Récupère les partages d'un patient
   */
  async byPatient({ params, response }: HttpContext) {
    try {
      const shares = await Share.query()
        .where('patient_id', params.patientId)
        .preload('doctor')
        .preload('patient')
        .orderBy('created_at', 'desc')

      return response.ok(shares)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des partages du patient',
        error: error.message,
      })
    }
  }

  /**
   * Recherche un partage spécifique entre un docteur et un patient
   */
  async findShare({ request, response }: HttpContext) {
    try {
      const { doctorId, patientId } = request.only(['doctorId', 'patientId'])

      const share = await Share.query()
        .where('doctor_id', doctorId)
        .where('patient_id', patientId)
        .preload('doctor')
        .preload('patient')
        .first()

      if (!share) {
        return response.notFound({
          message: 'Aucun partage trouvé entre ce docteur et ce patient',
        })
      }

      return response.ok(share)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la recherche du partage',
        error: error.message,
      })
    }
  }
}
