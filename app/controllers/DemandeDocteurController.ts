// Importations nécessaires
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DemandeDocteur from '../models/demande_docteur.js'
import { Docteur } from '../models/user.js'
import Role from '../models/role.js'
import { Status } from '../enum/enums.js'
import MailFordoctor from '#services/MailFordoctor'

export default class DemandeDocteurController {
  // Enregistrer une nouvelle demande
  public async store({ request, response }: HttpContextContract) {
    const data = request.only([
      'firstName', 
      'lastName', 
      'email', 
      'phone', 
      'licenseNumber', 
      'specialisation'
    ])
  
    // Create the doctor request (demande)
    const demande = await DemandeDocteur.create({ ...data, status: 'pending' })
  
    // Log the email that will be sent
    console.log(`Sending email to: ${demande.firstName}`)
  
    // Send the email after creating the demande
    await MailFordoctor.sendApprovalEmail(demande.email)
  
    // Return the response
    return response.created(demande)
  }
  

  // Lister toutes les demandes (admin)
  public async index({ response }: HttpContextContract) {
    const demandes = await DemandeDocteur.all()
    return response.ok(demandes)
  }

  // Voir le détail d'une demande
  public async show({ params, response }: HttpContextContract) {
    const demande = await DemandeDocteur.find(params.id)
    if (!demande) {
      return response.notFound({ message: 'Demande non trouvée' })
    }
    return response.ok(demande)
  }

  // Valider une demande et créer le compte docteur
  public async approve({ params, response }: HttpContextContract) {
    const demande = await DemandeDocteur.find(params.id)
    if (!demande) {
      return response.notFound({ message: 'Demande non trouvée' })
    }
    if (demande.status === 'approved') {
      return response.badRequest({ message: 'Déjà validée' })
    }
    // Création du rôle docteur si besoin
    let role = await Role.findBy('label', 'docteur')
    if (!role) {
      role = await Role.create({ label: 'docteur' })
    }
    // Création du compte docteur
    const docteur = await Docteur.create({
      first_name: demande.firstName,   // Utilisation de camelCase
      last_name: demande.lastName,     // Utilisation de camelCase
      email: demande.email,
      phone: demande.phone,
      license_number: demande.licenseNumber,  // Change to 'license_number'
      specialisation: demande.specialisation,
      roleId: role.id,
      accountStatus: Status.ACTIVE,
    })
    console.log(docteur)
    demande.status = 'approved'
    await demande.save()
  
  // Log avant l'envoi du mail


 }

  // Refuser une demande
  public async reject({ params, response }: HttpContextContract) {
    const demande = await DemandeDocteur.find(params.id)
    if (!demande) {
      return response.notFound({ message: 'Demande non trouvée' })
    }
    demande.status = 'rejected'
    await demande.save()
    return response.ok({ message: 'Demande refusée' })
  }
}
