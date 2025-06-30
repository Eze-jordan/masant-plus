import Paiement from '#models/paiement'
import ModePaiement from '#models/mode_paiement' // Ajoute ce modèle pour gérer les modes de paiement
import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusPaiement } from '../enum/enums.js'
import { CreateInvoice, GetInvoice, MakePushUSSD } from '#services/ebilling'

export default class PaiementsController {
  // Crée un paiement simple en base (ex: Stripe ou autre)
  public async create({ request, response }: HttpContextContract) {
    const { idUser, idAppointment, montant, modeId } = request.only(['idUser', 'idAppointment', 'montant', 'modeId'])

    try {
      const paiement = await Paiement.create({
        idUser,
        idAppointment,
        montant,
        statut: StatusPaiement.EN_ATTENTE,
        datePaiement: DateTime.now(),
        modeId,
      })

      return response.created({
        message: 'Paiement créé avec succès',
        paiement,
      })
    } catch (error) {
      return response.status(500).send({ message: 'Erreur création paiement', error: error.message })
    }
  }

  // Crée une facture Mobile Money via ebilling + push USSD, puis enregistre le paiement
  public async createMobileMoneyInvoice({ request, response }: HttpContextContract) {
    const {
      amount,
      payer_msisdn,
      payer_email,
      short_description,
      external_reference,
      description,
      expiry_period,
      payment_system_name,
      idUser,
      idAppointment,
    } = request.only([
      'amount',
      'payer_msisdn',
      'payer_email',
      'short_description',
      'external_reference',
      'description',
      'expiry_period',
      'payment_system_name',
      'idUser',
      'idAppointment',
    ])

    try {
      // Recherche du mode paiement "airtelmoney"
      let modeAirtel = await ModePaiement.query().where('label', 'airtelmoney').first()

      // Création si le mode paiement n'existe pas
      if (!modeAirtel) {
        modeAirtel = await ModePaiement.create({ label: 'airtelmoney' })
      }

      // Création de la facture
      const invoice = await CreateInvoice({
        amount,
        payer_msisdn,
        payer_email,
        short_description,
        external_reference,
        description,
        expiry_period,
      })

      const bill_id = invoice?.e_bill?.bill_id

      if (!bill_id) {
        console.error("Erreur lors de la création de la facture", invoice)
        return response.status(500).send({ message: 'Échec création facture.', detail: invoice })
      }

      // Envoi du push USSD
      const ussdResponse = await MakePushUSSD({ bill_id, payer_msisdn, payment_system_name })

      console.log("Réponse USSD : ", ussdResponse)

      // Enregistrement du paiement
      await Paiement.create({
        idUser: typeof idUser === 'string' ? parseInt(idUser, 10) : idUser ?? 0,
        idAppointment: typeof idAppointment === 'string' ? parseInt(idAppointment, 10) : idAppointment ?? 0,
        montant: amount,
        statut: StatusPaiement.EN_ATTENTE,
        datePaiement: DateTime.now(),
        modeId: modeAirtel.id,
      })

      return response.created({
        message: 'Facture créée et push USSD envoyé avec succès.',
        bill_id,
        invoice,
        ussdResponse,
      })
    } catch (error) {
      console.error("Erreur lors du traitement Mobile Money:", error)
      return response.status(500).send({ message: 'Erreur traitement Mobile Money.', error: error.message })
    }
  }

  // Vérifie le statut d'une facture par bill_id
  public async checkInvoiceStatus({ params, response }: HttpContextContract) {
    const billId = params.bill_id

    try {
      const result = await GetInvoice(billId)
      return response.ok({ message: 'Facture récupérée avec succès.', data: result })
    } catch (error) {
      return response.status(500).send({ message: 'Erreur récupération facture.', error })
    }
  }
}
