// Importations nécessaires
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DemandeDocteur from '../models/demande_docteur.js'
import { Docteur } from '../models/user.js'
import Role from '../models/role.js'
import { Status } from '../enum/enums.js'
import MailFordoctor from '#services/MailFordoctor'
import mail_approve from '#services/mail_approve'
import SpecialiteDoctor from '#models/specialite_doctor'
import Specialite from '#models/specialite'
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
    // 1. Récupérer la demande
    const demande = await DemandeDocteur.find(params.id)
    if (!demande) {
      return response.notFound({ message: 'Demande non trouvée' })
    }
  
    // 2. Empêcher les validations multiples
    if (demande.status === 'approved') {
      return response.badRequest({ message: 'La demande a déjà été validée.' })
    }
  
    // 3. Vérifier ou créer le rôle "doctor"
    const role = await Role.firstOrCreate({ label: 'doctor' })
  
    // 4. Générer un mot de passe et préparer le nom complet
    const password = generateRandomPassword(12)
    const fullName = `${demande.firstName} ${demande.lastName}`
  
    // 5. Envoyer les infos du compte par mail
    await mail_approve.sendAccountInfo(demande.email!, fullName, password)
    console.log(`📩 Email envoyé à : ${demande.email}`)
  
    // 6. Créer le compte docteur
    await Docteur.create({
      first_name: demande.firstName,
      last_name: demande.lastName,
      email: demande.email,
      phone: demande.phone,
      license_number: demande.licenseNumber,
      specialisation: demande.specialisation,
      roleId: role.id,
      password,
      accountStatus: Status.ACTIVE,
      type: 'doctor',
    })
  
    // 7. Récupérer le docteur créé par son email unique
    const docteurFromDb = await Docteur.query().where('email', demande.email).first()
  
    if (!docteurFromDb) {
      return response.internalServerError({ message: 'Erreur lors de la création du compte docteur' })
    }
  
    // 8. Associer une spécialité si renseignée
    if (demande.specialisation) {
      const specialite = await Specialite.firstOrCreate(
        { label: demande.specialisation },
        { label: demande.specialisation }
      )
  
      await SpecialiteDoctor.create({
        doctorId: docteurFromDb.id,
        specialiteId: specialite.id,
      })
    }
  
    // 9. Marquer la demande comme approuvée
    demande.status = 'approved'
    await demande.save()
  
    // 10. Réponse OK
    console.log(`✅ Demande approuvée pour : ${fullName}`)
    return response.ok({
      message: 'Demande validée et compte docteur créé',
      docteur: docteurFromDb.serialize(),
    })
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
 

