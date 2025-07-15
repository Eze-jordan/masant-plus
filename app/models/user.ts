import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Status } from '../enum/enums.js'
import Role from './role.js'
import Appointment from './appointment.js'
import Like from './like.js'
import Experience from './experience.js'
import Disponibilite from './disponibilite.js'
import Notification from './notification.js'
import Feedback from './feedback.js'
import Suggestion from './suggestion.js'
import Paiement from './paiement.js'
import Message from './message.js'
import Discussion from './discussion.js'
import SpecialiteDoctor from './specialite_doctor.js'
import ServiceDoctor from './service_doctor.js'
import SessionUser from './session_user.js'
import LiveUser from './live.js'

import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public email?: string

  @column()
  public phone?: string

  @column({ serializeAs: null })
  public password?: string

  @column()
  public first_name?: string

  @column()
  public last_name?: string


  @column()
  public declare address?: string // Ajout de la déclaration pour éviter les erreurs

  @column()
  public accountStatus?: Status

  @column()
  public expoPushToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @column()
  public roleId?: string

  @column()
  public profileImage!: string

  @belongsTo(() => Role)
  public role!: BelongsTo<typeof Role>

  @hasMany(() => SessionUser)
  public sessions!: HasMany<typeof SessionUser>

  @hasMany(() => Notification, { foreignKey: 'idUser' })
  public notifications!: HasMany<typeof Notification>

  @hasMany(() => Feedback, { foreignKey: 'idUser' })
  public feedbacks!: HasMany<typeof Feedback>

  @hasMany(() => Suggestion, { foreignKey: 'idUser' })
  public suggestions!: HasMany<typeof Suggestion>

  @hasMany(() => Paiement, { foreignKey: 'idUser' })
  public paiements!: HasMany<typeof Paiement>

  @hasMany(() => Message, { foreignKey: 'idUserSender' })
  public messagesSent!: HasMany<typeof Message>

  @hasMany(() => Discussion, { foreignKey: 'idPatient' })
  public discussionsPatient!: HasMany<typeof Discussion>

  @hasMany(() => Like, { foreignKey: 'idUser' })
  public likesSent!: HasMany<typeof Like>

  @hasMany(() => LiveUser)
  public liveUsers!: HasMany<typeof LiveUser>

  public static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Appointment, { foreignKey: 'idDoctor' })
  public appointmentsAsDoctor!: HasMany<typeof Appointment>

  @hasMany(() => Like, { foreignKey: 'idDoctor' })
  public likesReceived!: HasMany<typeof Like>

  @hasMany(() => Experience, { foreignKey: 'idDoctor' })
  public experiences!: HasMany<typeof Experience>

  @hasMany(() => Disponibilite, { foreignKey: 'idDoctor' })
  public disponibilites!: HasMany<typeof Disponibilite>

  @hasMany(() => Discussion, { foreignKey: 'idDoctor' })
  public discussionsDoctor!: HasMany<typeof Discussion>

  @hasMany(() => SpecialiteDoctor, { foreignKey: 'idDoctor' })
  public specialites!: HasMany<typeof SpecialiteDoctor>

  @hasMany(() => ServiceDoctor, { foreignKey: 'idDoctor' })
  public services!: HasMany<typeof ServiceDoctor>

  @column()
  public type: 'doctor' | 'patient' | 'admin' = (() => {
    if (this instanceof Docteur) return 'doctor'
    if (this instanceof Patient) return 'patient'
    return 'admin' // ou une autre valeur par défaut
  })() as 'doctor' | 'patient' | 'admin'

  // Méthode pour vérifier le type
  public get isDoctor() {
    return this.type === 'doctor'
  }

  
}

export class Docteur extends User {
  public static selfAssignPrimaryKey = true // Important pour l'héritage

  @column()
  public declare license_number?: string // `declare` pour éviter les conflits

  @column()
  public declare specialisation?: string
}

export class Patient extends User {
  public static selfAssignPrimaryKey = true

  @column({ serializeAs: null }) // Optionnel: masquer l'adresse dans les sérialisations
  public declare address?: string
}