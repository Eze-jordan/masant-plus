// Importations nécessaires
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DemandeDocteur from '../models/demande_docteur.js'
import { Docteur } from '../models/user.js'
import Role from '../models/role.js'
import { Status } from '../enum/enums.js'
import MailFordoctor from '#services/MailFordoctor'
import mail_approve from '#services/mail_approve'
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
} 
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
  
    // Vérifier si une demande existe déjà avec cet email
    const existing = await DemandeDocteur.query().where('email', data.email).first()
    if (existing) {
      return response.badRequest({ message: 'Une demande avec cet email existe déjà.' })
    }
  
    // Créer la demande
    const demande = await DemandeDocteur.create({ ...data, status: 'pending' })
  
    console.log(`Envoi d'email à: ${demande.firstName}`)
  
    await MailFordoctor.sendApprovalEmail(demande.firstName, demande.email)
  
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
    let role = await Role.findBy('label', 'doctor')
    if (!role) {
      role = await Role.create({ label: 'doctor' })
    }
    
    const password = generateRandomPassword(12)
    // Créer un message avec les informations de l'utilisateur
    const fullName = `${demande.firstName} ${demande.lastName}`
    
    // Envoyer l'email avant la création du docteur
    await mail_approve.sendAccountInfo(demande.email!, fullName, password)
    console.log(`Email envoyé à: ${demande.email} avant la création du compte`)

    // Création du compte docteur
    const docteur = await Docteur.create({
      first_name: demande.firstName,
      last_name: demande.lastName,
      email: demande.email,
      phone: demande.phone,
      license_number: demande.licenseNumber,
      specialisation: demande.specialisation,
      roleId: role.id,
      password: password,
      accountStatus: Status.ACTIVE,
      type: 'doctor' // Assurez-vous que ce champ est bien défini
    })

    // Mettre à jour le statut de la demande
    demande.status = 'approved'
    await demande.save()

    // Log avant l'envoi du mail
    console.log(`Demande de ${fullName} approuvée et le compte docteur créé.`)
    return response.ok({ message: 'Demande validée et compte docteur créé', docteur })
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

