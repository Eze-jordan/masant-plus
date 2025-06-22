import User from '#models/user'
import Role from '#models/role'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createUserValidator } from '#validators/create_user'
import { Status } from '../enum/enums.js'

export default class RegisterController {
  public async register(ctx: HttpContextContract) {
    const raw = ctx.request.all()
    ctx.logger.info('[RegisterController] Données brutes reçues :', raw)

    // Mapping des données camelCase -> snake_case
    const requestData = {
      username: raw.email,
      email: raw.email,
      password: raw.password,
      first_name: raw.firstName,
      last_name: raw.lastName,
      phone: raw.phone,
      address: raw.address,
      specialisation: raw.specialty,
      years_experience: parseInt(raw.experience?.split('-')[0]) || 0,
      certificate_url: raw.certificate ?? 'https://example.com/fake-cert',
      registration_number: raw.licenseNumber,
      institution_name: raw.institution,
      role: raw.role,
      about: 'N/A',
      account_status: Status.PENDING,
      availability: 'N/A',
      localisation: 'N/A',
    }

    try {
      const validatedData = await createUserValidator.validate(requestData)
      ctx.logger.info('[RegisterController] Données validées :', validatedData)

      // Vérifie si utilisateur existe déjà
      const userExists = await User.findBy('email', validatedData.email)
      if (userExists) {
        ctx.logger.warn('[RegisterController] Utilisateur déjà existant avec email :', validatedData.email)
        return ctx.response.status(400).send({
          message: 'Un utilisateur avec cet email existe déjà.',
        })
      }

      // Gère le rôle
      const roleLabel = validatedData.role?.toUpperCase() ?? 'USER'
      let roleRecord = await Role.query().where('label', roleLabel).first()

      if (!roleRecord) {
        roleRecord = await Role.create({ label: roleLabel })
        ctx.logger.info('[RegisterController] Rôle créé :', roleRecord)
      } else {
        ctx.logger.info('[RegisterController] Rôle trouvé :', roleRecord)
      }

      // Exclure 'role' string pour éviter conflit avec BelongsTo
      const { role, ...sanitizedData } = validatedData

      const userData: Partial<typeof User.prototype> = {
        ...sanitizedData,
        roleId: roleRecord.id,
      }

      ctx.logger.info('[RegisterController] Données filtrées pour création :', userData)

      const user = await User.create(userData)
      ctx.logger.info('[RegisterController] Utilisateur créé :', user)

      return ctx.response.status(201).send({
        message: 'Utilisateur créé avec succès.',
        user,
      })

    } catch (error) {
      ctx.logger.error('[RegisterController] Erreur lors de la création de l\'utilisateur')

      if (error instanceof Error) {
        ctx.logger.error('[RegisterController] Message :', error.message)
        ctx.logger.error('[RegisterController] Stack :', error.stack)
        return ctx.response.status(500).send({
          message: 'Une erreur est survenue lors de la création de l\'utilisateur.',
          error: error.message,
        })
      }

      return ctx.response.status(500).send({
        message: 'Une erreur inattendue est survenue.',
        error: JSON.stringify(error),
      })
    }
  }
}
