import Paiement from '#models/paiement'
import ModePaiement from '#models/mode_paiement'
import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, StatusPaiement } from '../enum/enums.js'
import { CreateInvoice, GetInvoice, MakePushUSSD } from '#services/ebilling'
import Appointment from '#models/appointment'

export default class PaiementsController {
  /**
   * Crée un paiement simple en base (ex: Stripe ou autre)
   */

public async index({ response }: HttpContextContract) {
  try {
    const paiements = await Paiement.query()
      .preload('user')
      .orderBy('datePaiement', 'desc')

    const data = paiements.map(paiement => ({
      id: paiement.id,
      montant: paiement.montant,
      datePaiement: paiement.datePaiement,
      first_name: paiement.user?.first_name,
      last_name: paiement.user?.last_name,
      email: paiement.user?.email,  // <-- ajouté ici
    }))

    return response.ok(data)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ message: 'Erreur lors de la récupération des paiements.' })
  }
}



public async create({ request, response }: HttpContextContract) {
  const { idUser, idAppointment, montant, modeId, numeroTelephone } = request.only([
    'idUser',
    'idAppointment',
    'montant',
    'modeId',
    'numeroTelephone',
  ])

  try {
    const paiement = await Paiement.create({
      idUser,
      idAppointment,
      montant,
      statut: StatusPaiement.PAYE,
      datePaiement: DateTime.now(),
      modeId,
      numeroTelephone,
    })

    // 🔁 Mettre à jour le rendez-vous à CONFIRME
    const rdv = await Appointment.find(idAppointment)
    if (rdv) {
      rdv.etatRdv = EtatRDV.CONFIRME
      await rdv.save()
    }

    return response.created({
      message: 'Paiement créé et rendez-vous confirmé avec succès',
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
public async createvisaMoneyInvoice({ request, response }: HttpContextContract) {
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

    // Vérifie si la facture est correctement générée
    if (!invoice?.e_bill?.bill_id) {
      throw new Error('Erreur lors de la génération de la facture eBilling.')
    }

    const bill_id = invoice.e_bill.bill_id // Récupération de l'ID de la facture eBilling

    // Déterminer si la facture est déjà payée (si applicable)
    const isPaid = invoice.e_bill.status === 'PAYE' // Vérifier si la facture est payée

    // 3. Création du paiement avec l'ID de la facture eBilling
    const paiement = await Paiement.create({
      idUser,
      idAppointment,
      montant: amount,
      statut: isPaid ? StatusPaiement.PAYE : StatusPaiement.EN_ATTENTE,
      datePaiement: DateTime.now(),
      modeId: modePaiement.id,
      numeroTelephone: payer_msisdn,
      billing_id: bill_id,  // Enregistrement de l'ID de la facture
    })

    // 4. Si payé immédiatement → mise à jour du rendez-vous
    if (isPaid) {
      const appointment = await Appointment.find(idAppointment)
      if (appointment) {
        appointment.etatRdv = EtatRDV.CONFIRME
        await appointment.save()
      }
    }

    // 5. Envoi du push USSD (optionnel)
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
    }

    // 6. Générer le lien de redirection pour Visa avec l'ID de la facture
    const redirectUrl = `https://test.billing-easy.net?invoice=${bill_id}&redirect_url=https://myredirecturl.com`

    // 7. Réponse finale avec le lien
    return response.created({
      message: isPaid
        ? 'Paiement confirmé. Rendez-vous mis à jour.'
        : 'Paiement enregistré. Facture créée et push tenté.',
      bill_id,
      paiement,
      invoice,
      ussdResponse,
      redirectUrl,  // Ajoute le lien généré dans la réponse
    })
  } catch (error: any) {
    console.error('Erreur lors du traitement Mobile Money:', error)
    return response.status(500).send({
      message: 'Erreur lors du traitement Mobile Money.',
      error: error.message,
    })
  }
}

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

      // Vérifie si la facture est correctement générée
      if (!invoice?.e_bill?.bill_id) {
        throw new Error('Erreur lors de la génération de la facture eBilling.')
      }

      const bill_id = invoice.e_bill.bill_id // Récupération de l'ID de la facture eBilling

      // Déterminer si la facture est déjà payée (si applicable)
      const isPaid = invoice.e_bill.status === 'PAYE' // Vérifier si la facture est payée

      // 3. Création du paiement avec l'ID de la facture eBilling
      const paiement = await Paiement.create({
        idUser,
        idAppointment,
        montant: amount,
        statut: isPaid ? StatusPaiement.PAYE : StatusPaiement.EN_ATTENTE,
        datePaiement: DateTime.now(),
        modeId: modePaiement.id,
        numeroTelephone: payer_msisdn,
        billing_id: bill_id,  // Enregistrement de l'ID de la facture
      })

      // 4. Si payé immédiatement → mise à jour du rendez-vous
      if (isPaid) {
        const appointment = await Appointment.find(idAppointment)
        if (appointment) {
          appointment.etatRdv = EtatRDV.CONFIRME
          await appointment.save()
        }
      }

      // 5. Envoi du push USSD (optionnel)
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
      }

      // 6. Réponse finale
      return response.created({
        message: isPaid
          ? 'Paiement confirmé. Rendez-vous mis à jour.'
          : 'Paiement enregistré. Facture créée et push tenté.',
        bill_id,
        paiement,
        invoice,
        ussdResponse,
      })
    } catch (error: any) {
      console.error('Erreur lors du traitement Mobile Money:', error)
      return response.status(500).send({
        message: 'Erreur lors du traitement Mobile Money.',
        error: error.message,
      })
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
