import Paiement from '#models/paiement'
import ModePaiement from '#models/mode_paiement'
import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StatusPaiement } from '../enum/enums.js'
import { CreateInvoice, GetInvoice, MakePushUSSD } from '#services/ebilling'

export default class PaiementsController {
  /**
   * Crée un paiement simple en base (ex: Stripe ou autre)
   */
  public async create({ request, response }: HttpContextContract) {
    const { idUser, idAppointment, montant, modeId } = request.only([
      'idUser',
      'idAppointment',
      'montant',
      'modeId',
    ])

    try {
      const paiement = await Paiement.create({
        idUser,
        idAppointment,
        montant,
        statut: StatusPaiement.PAYE,
        datePaiement: DateTime.now(),
        modeId,
      })

      return response.created({
        message: 'Paiement créé avec succès',
        paiement,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la création du paiement',
        error: error.message,
      })
    }
  }

  
  /**
   * Crée une facture Mobile Money via eBilling + push USSD, puis enregistre le paiement
   */
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
      // 1. Détection du mode de paiement (basé sur le numéro)
      const modeLabel = this.detectPaymentLabel(payer_msisdn)
      let modePaiement = await ModePaiement.query().where('label', modeLabel).first()
      if (!modePaiement) {
        modePaiement = await ModePaiement.create({ label: modeLabel })
      }
  
      // 2. Création de la facture via eBilling
      const invoice = await CreateInvoice({
        amount,
        payer_msisdn,
        payer_email,
        short_description,
        external_reference,
        description,
        expiry_period,
      })
  
      const bill_id = invoice?.e_bill?.bill_id ?? null
  
      // 3. Enregistrement du paiement, même si le push échoue
      const paiement = await Paiement.create({
        idUser: idUser,
        idAppointment: idAppointment,
        montant: amount,
        statut: StatusPaiement.EN_ATTENTE,
        datePaiement: DateTime.now(),
        modeId: modePaiement.id,
        numeroTelephone: payer_msisdn,
      })
  
      // 4. Envoi du push USSD (optionnel)
      let ussdResponse = null
      try {
        if (bill_id) {
          ussdResponse = await MakePushUSSD({ bill_id, payer_msisdn, payment_system_name })
          console.log('Réponse USSD:', ussdResponse)
        } else {
          console.warn('Pas de bill_id, push USSD ignoré.')
        }
      } catch (pushError) {
        console.error('Erreur lors de l\'envoi du push USSD :', pushError)
        // Le paiement est enregistré, donc on ne bloque pas la réponse ici
      }
  
      return response.created({
        message: 'Paiement enregistré. Facture créée et push tenté.',
        bill_id,
        paiement,
        invoice,
        ussdResponse,
      })
    } catch (error: any) {
      console.error('Erreur traitement Mobile Money:', error)
      return response.status(500).send({ message: 'Erreur traitement Mobile Money.', error: error.message })
    }
  }
  

  /**
   * Vérifie le statut d'une facture par bill_id
   */
  public async checkInvoiceStatus({ params, response }: HttpContextContract) {
    const billId = params.bill_id

    try {
      const result = await GetInvoice(billId)
      return response.ok({ message: 'Facture récupérée avec succès.', data: result })
    } catch (error: any) {
      return response.status(500).send({ message: 'Erreur récupération facture.', error: error.message })
    }
  }

  /**
   * Détecte le mode de paiement à partir du numéro de téléphone
   */
  private detectPaymentLabel(numero: string): string {
    if (numero.startsWith('077') || numero.startsWith('076')) {
      return 'airtelmoney'
    }
    return 'liberits'
  }
}
