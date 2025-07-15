
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Status } from '../enum/enums.js'
import User from '#models/user'
import Role from '#models/role'
import { GetInvoice } from '#services/ebilling'
import Paiement from '#models/paiement'
import Feedback from '#models/feedback'

export default class AccountManagementController {
  public async createAccount({ request, response }: HttpContextContract) {
    const {  email, password, role, first_name, last_name, phone } = request.only([
      'email', 'password', 'role', 'first_name', 'last_name', 'phone'
    ])

    try {
      let userRole = await Role.findBy('label', role)
      if (!userRole) {
        userRole = await Role.create({ label: role })
      }

      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.status(400).send({
          message: 'Un utilisateur avec cet email existe déjà.',
        })
      }

      const plainPassword = password || 'changeme123'

      const user = await User.create({
        email,
        password: plainPassword,
        roleId: userRole.id,
        first_name: first_name,
        last_name: last_name,
        phone,
      })

      user.password = undefined

      return response.created({
        message: password
          ? 'Compte utilisateur créé avec succès.'
          : 'Compte utilisateur créé avec mot de passe par défaut : changeme123',
        user,
      })

    } catch (error:any) {
      return response.status(500).send({
        message: "Erreur lors de la création de l'utilisateur.",
        error: error.message,
      })
    }
  }

  public async suspendAccount({ params, response }: HttpContextContract) {
    const user = await User.find(params.userId)
    if (!user) {
      return response.status(404).send({ message: 'Utilisateur non trouvé.' })
    }

    user.accountStatus = Status.INACTIVE
    await user.save()

    return response.ok({
      message: `Le compte de l'utilisateur ${user.first_name} a été suspendu.`,
      user,
    })
  }

  public async deleteAccount({ params, response }: HttpContextContract) {
    const user = await User.find(params.userId)
    if (!user) return response.status(404).send({ message: 'Utilisateur non trouvé.' })

    await user.delete()

    return response.ok({ message: `Le compte de l'utilisateur ${user.first_name} a été supprimé.` })
  }

  public async getUserDetails({ params, response }: HttpContextContract) {
    const user = await User.query()
      .where('id', params.userId)
      .preload('role')
      .first()

    if (!user) return response.status(404).send({ message: 'Utilisateur non trouvé.' })
    user.password = undefined

    return response.ok(user)
  }

  public async getAllUsers({ response }: HttpContextContract) {
    const users = await User.query().preload('role')
    return response.ok(users)
  }

  public async deleteFeedback({ params, response }: HttpContextContract) {
    const feedback = await Feedback.find(params.id)
    if (!feedback) return response.status(404).send({ message: 'Feedback non trouvé.' })

    await feedback.delete()

    return response.ok({ message: 'Feedback supprimé avec succès.' })
  }

  public async getAllFeedbacks({ response }: HttpContextContract) {
    try {
      const feedbacks = await Feedback.query().preload('user')
      return response.ok({ message: 'Liste des feedbacks récupérée avec succès.', feedbacks })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des feedbacks.',
        error: error.message,
      })
    }
  }

  public async getUserPayments({ params, response }: HttpContextContract) {
    try {
      const payments = await Paiement.query()
        .where('idUser', params.userId)
        .preload('user')
        .preload('appointment')
        .preload('mode')

      if (payments.length === 0) {
        return response.status(404).send({ message: 'Aucun paiement trouvé pour cet utilisateur.' })
      }

      return response.ok({ message: 'Paiements récupérés avec succès.', payments })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des paiements.',
        error: error.message,
      })
    }
  }

  public async getPaymentDetails({ params, response }: HttpContextContract) {
    try {
      const payment = await Paiement.query()
        .where('id', params.paymentId)
        .preload('user')
        .preload('appointment')
        .preload('mode')
        .first()

      if (!payment) {
        return response.status(404).send({ message: 'Paiement non trouvé.' })
      }

      return response.ok({ message: 'Détails du paiement récupérés avec succès.', payment })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des détails du paiement.',
        error: error.message,
      })
    }
  }

  public async deletePayment({ params, response }: HttpContextContract) {
    const payment = await Paiement.find(params.paymentId)
    if (!payment) return response.status(404).send({ message: 'Paiement non trouvé.' })

    await payment.delete()

    return response.ok({ message: 'Paiement supprimé avec succès.' })
  }

  public async getAllPayments({ response }: HttpContextContract) {
    try {
      const payments = await Paiement.query()
        .preload('user')
        .preload('appointment')
        .preload('mode')

      if (payments.length === 0) {
        return response.status(404).send({ message: 'Aucun paiement trouvé.' })
      }

      return response.ok({ message: 'Liste des paiements récupérée avec succès.', payments })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des paiements.',
        error: error.message,
      })
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    const feedback = await Feedback.find(params.id)
    if (!feedback) return response.status(404).send({ message: 'Feedback non trouvé.' })

    await feedback.delete()

    return response.ok({ message: 'Feedback supprimé avec succès.' })
  }

  public async getAll({ response }: HttpContextContract) {
    try {
      const feedbacks = await Feedback.query().preload('user')
      return response.ok({ message: 'Liste des feedbacks récupérée avec succès.', feedbacks })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des feedbacks.',
        error: error.message,
      })
    }
  }

  public async checkInvoiceStatus({ params, response }: HttpContextContract) {
    const billId = params.bill_id
    try {
      const result = await GetInvoice(billId)
      return response.ok({ message: 'Facture récupérée avec succès.', data: result })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur récupération facture.',
        error: error.message,
      })
    }
  }

  public async getMobileMoneyPayments({ response }: HttpContextContract) {
    try {
      const mobileMoneyModes = ['airtemoney', 'moovmoney', 'orangemoney']
      const payments = await Paiement.query()
        .whereIn('mode_id', async (builder) => {
          builder
            .from('mode_paiements')
            .select('id')
            .whereIn('label', mobileMoneyModes)
        })
        .preload('user')
        .preload('appointment')
        .preload('mode')

      return response.ok({ message: 'Paiements Mobile Money récupérés avec succès.', data: payments })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des paiements Mobile Money.',
        error: error.message,
      })
    }
  }
}
