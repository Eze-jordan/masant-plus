import Discussion from '#models/discussion'
import Live from '#models/live'
import LiveUser from '#models/liveUser'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'



export default class LiveController {
  
  /**
   * Créer un live pour les utilisateurs d'une discussion
   */
  public async createLive({ params, response }: HttpContextContract) {
    const { idDiscussion } = params

    try {
      console.log('Création du live pour la discussion:', idDiscussion)

      // Récupérer la discussion
      const discussion = await Discussion.query()
        .where('id', idDiscussion)
        .preload('doctor')
        .preload('patient')
        .first()

      if (!discussion) {
        console.log('Discussion non trouvée')
        return response.status(404).send({ message: 'Discussion non trouvée.' })
      }

      const doctor = discussion.doctor
      const patient = discussion.patient

      if (!doctor || !patient) {
        console.log('Doctor ou patient manquant dans la discussion')
        return response.status(400).send({ message: 'Discussion incomplète.' })
      }

      // Créer le live
      const live = await Live.create({
        name: `Live Discussion ${discussion.id}`,
        doctorId: doctor.id,   // <-- Ajout du doctorId
        patientId: patient.id, // <-- Ajout du patientId
      })

      console.log('Live créé:', live)

      // Associer les utilisateurs au live
      await LiveUser.createMany([
        { liveId: live.id, userId: doctor.id },
        { liveId: live.id, userId: patient.id },
      ])

      console.log('LiveUser créés pour doctor et patient')

      return response.created({
        message: 'Live créé avec succès.',
        data: live,
      })
    } catch (error: any) {
      console.error('Erreur création live:', error.message)
      return response.status(500).send({
        message: 'Erreur lors de la création du live.',
        error: error.message,
      })
    }
  }

  /**
   * Récupérer les lives d'un utilisateur
   */
  public async getLivesByUser({ params, response }: HttpContextContract) {
    const { userId } = params // ID de l'utilisateur

    try {
      // Récupérer tous les lives auxquels l'utilisateur participe
      const liveUsers = await LiveUser.query()
        .where('userId', userId)
        .preload('live') // Charger les informations du live
        .preload('user') // Charger les informations de l'utilisateur

      if (liveUsers.length === 0) {
        return response.ok({
          message: 'Aucun live trouvé pour cet utilisateur.',
          data: [],
        })
      }

      const lives = liveUsers.map(liveUser => ({
        id: liveUser.live.id,
        name: liveUser.live.name,
        createdAt: liveUser.live.createdAt,
        user: liveUser.user.first_name + ' ' + liveUser.user.first_name,
      }))

      return response.ok({
        message: 'Lives récupérés avec succès.',
        data: lives,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des lives.',
        error: error.message,
      })
    }
  }

  /**
   * Récupérer les utilisateurs d'un live
   */
  public async getUsersByLive({ params, response }: HttpContextContract) {
    const { liveId } = params // ID du live

    try {
      // Récupérer tous les utilisateurs associés à ce live
      const liveUsers = await LiveUser.query()
        .where('liveId', liveId)
        .preload('user') // Charger les informations de l'utilisateur

      if (liveUsers.length === 0) {
        return response.status(404).send({
          message: 'Aucun utilisateur trouvé pour ce live.',
        })
      }

      const users = liveUsers.map(liveUser => ({
        id: liveUser.user.id,
        firstName: liveUser.user.first_name,
        last_name: liveUser.user.last_name,
        avatar: liveUser.user.profileImage || `https://ui-avatars.com/api/?name=${liveUser.user.first_name}+${liveUser.user.last_name}`,
      }))

      return response.ok({
        message: 'Utilisateurs récupérés avec succès.',
        data: users,
      })
    } catch (error: any) {
      return response.status(500).send({
        message: 'Erreur lors de la récupération des utilisateurs du live.',
        error: error.message,
      })
    }
  }
  
}
