import Paiement from '#models/paiement'
import ModePaiement from '#models/mode_paiement'
import { DateTime } from 'luxon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EtatRDV, StatusPaiement } from '../enum/enums.js'
import { CreateInvoice, GetInvoice, MakePushUSSD } from '#services/ebilling'
import Appointment from '#models/appointment'
import User from '#models/user'

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
    let {
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
    ]);

    console.log('payer_msisdn:', payer_msisdn);
    console.log('payment_system_name:', payment_system_name);

    try {
      if (payment_system_name !== 'visa') {
        throw new Error('Seul le mode de paiement Visa est accepté.');
      }

      // Si tu veux forcer le numéro pour test
      payer_msisdn = '074699792';

      if (!payer_msisdn) {
        throw new Error('Le numéro de téléphone est requis pour détecter le mode de paiement.');
      }

      console.log('payer_msisdn après vérification:', payer_msisdn);

      // Détecter le mode de paiement
      const modeLabel = this.detectPaymentLabel(payer_msisdn);
      let modePaiement = await ModePaiement.query().where('label', modeLabel).first();
      if (!modePaiement) {
        modePaiement = await ModePaiement.create({ label: modeLabel });
      }

      // Créer la facture
      const invoice = await CreateInvoice({
        amount,
        payer_msisdn,
        payer_email,
        short_description,
        external_reference,
        description,
        expiry_period,
      });

      if (!invoice?.e_bill?.bill_id) {
        throw new Error('Erreur lors de la génération de la facture eBilling.');
      }

      const bill_id = invoice.e_bill.bill_id;
      const isPaid = invoice.e_bill.status === 'PAYE';

      // Créer le paiement
      const paiement = await Paiement.create({
        idUser,
        idAppointment,
        montant: amount,
        statut: isPaid ? StatusPaiement.PAYE : StatusPaiement.PAYE,
        datePaiement: DateTime.now(),
        modeId: modePaiement.id,
        numeroTelephone: payer_msisdn,
        billing_id: bill_id,
      });

      // Après paiement confirmé
      if (isPaid) {
        const appointment = await Appointment.find(idAppointment);
        if (appointment) {
          // Mettre à jour l'état du rendez-vous
          appointment.etatRdv = EtatRDV.CONFIRME;
          await appointment.save();

          // Charger le créneau associé
          const creneau = await appointment.related('creneau').query().first();
          if (creneau) {
            creneau.disponible = false;
            creneau.isUsed = true;
            await creneau.save();
            console.log(`Creneau ${creneau.id} mis à jour : disponible=false, isUsed=true`);
          } else {
            console.warn('Aucun créneau trouvé pour ce rendez-vous.');
          }
        }
      }

      // Push USSD
      let ussdResponse = null;
      try {
        if (bill_id) {
          ussdResponse = await MakePushUSSD({ bill_id, payer_msisdn, payment_system_name });
          console.log('Réponse USSD:', ussdResponse);
        } else {
          console.warn('Pas de bill_id, push USSD ignoré.');
        }
      } catch (pushError) {
        console.error('Erreur lors de l\'envoi du push USSD :', pushError);
      }

      // Notification push Expo
      const user = await User.find(idUser);
      if (user && user.expoPushToken) {
        const pushBody = {
          to: user.expoPushToken,
          title: 'Paiement confirmé',
          body: `Votre paiement de ${amount}€ pour le rendez-vous ${idAppointment} a été confirmé.`,
          data: { bill_id, appointment_id: idAppointment },
        };

        try {
          const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(pushBody),
          });
          const responseData: any = await expoResponse.json();
          if (responseData.errors) {
            console.error('Erreur lors de l\'envoi de la notification push Expo:', responseData.errors);
          } else {
            console.log('Notification push Expo envoyée avec succès:', responseData);
          }
        } catch (error) {
          console.error('Erreur lors de l\'envoi de la notification push:', error);
        }
      }

      const redirectUrl = `https://test.billing-easy.net?invoice=${bill_id}&redirect_url=https://myredirecturl.com`;

      return response.created({
        message: isPaid
          ? 'Paiement confirmé. Rendez-vous mis à jour.'
          : 'Paiement enregistré. Facture créée et push tenté.',
        bill_id,
        paiement,
        invoice,
        ussdResponse,
        redirectUrl,
      });
    } catch (error: any) {
      console.error('Erreur lors du traitement Mobile Money:', error);
      return response.status(500).send({
        message: 'Erreur lors du traitement Mobile Money.',
        error: error.message,
      });
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
  ]);

  try {
    // 1. Détection du mode de paiement (basé sur le numéro)
    const modeLabel = this.detectPaymentLabel(payer_msisdn);
    let modePaiement = await ModePaiement.query().where('label', modeLabel).first();
    if (!modePaiement) {
      modePaiement = await ModePaiement.create({ label: modeLabel });
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
    });

    const bill_id = invoice?.e_bill?.bill_id ?? null;

    // Déterminer si la facture est déjà payée
    const isPaid = invoice?.e_bill?.status === 'PAYE';

    // 3. Création du paiement avec le bon statut
    const paiement = await Paiement.create({
      idUser,
      idAppointment,
      montant: amount,
      statut: isPaid ? StatusPaiement.PAYE : StatusPaiement.PAYE,
      datePaiement: DateTime.now(),
      modeId: modePaiement.id,
      numeroTelephone: payer_msisdn,
    });

    // 4. Si payé immédiatement → mise à jour du rendez-vous et du créneau
    if (isPaid) {
      const appointment = await Appointment.find(idAppointment);
      if (appointment) {
        appointment.etatRdv = 'CONFIRME';
        await appointment.save();

        // Récupérer le créneau associé
        const creneau = await appointment.related('creneau').query().first();
        if (creneau) {
          creneau.disponible = false;
          creneau.isUsed = true;
          await creneau.save();
          console.log(`Creneau ${creneau.id} mis à jour : disponible=false, isUsed=true`);
        } else {
          console.warn('Aucun créneau trouvé pour ce rendez-vous.');
        }
      }
    }

    // 5. Envoi du push USSD (optionnel)
    let ussdResponse = null;
    try {
      if (bill_id) {
        ussdResponse = await MakePushUSSD({ bill_id, payer_msisdn, payment_system_name });
        console.log('Réponse USSD:', ussdResponse);
      } else {
        console.warn('Pas de bill_id, push USSD ignoré.');
      }
    } catch (pushError) {
      console.error('Erreur lors de l\'envoi du push USSD :', pushError);
    }

    // 6. Réponse finale
    return response.created({
      message: isPaid
        ? 'Paiement confirmé. Rendez-vous et créneau mis à jour.'
        : 'Paiement enregistré. Facture créée et push tenté.',
      bill_id,
      paiement,
      invoice,
      ussdResponse,
    });
  } catch (error: any) {
    console.error('Erreur traitement Mobile Money:', error);
    return response.status(500).send({
      message: 'Erreur lors du traitement Mobile Money.',
      error: error.message,
    });
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
