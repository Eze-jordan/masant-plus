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
import Messages from './message.js'
import Discussion from './discussion.js'
import SpecialiteDoctor from './specialite_doctor.js'
import ServiceDoctor from './service_doctor.js'
import DiscussionMessagery from './discussion_messagery.js'
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
  public id!: number

  @column()
  public username?: string

  @column()
  public email?: string

  @column()
  public phone?: string

  @column({ serializeAs: null })
  public password?: string

  @column()
  public availability?: string

  @column()
  public firstName?: string

  @column()
  public lastName?: string

  @column()
  public registrationNumber?: string

  @column()
  public institutionName?: string

  @column()
  public certificateUrl?: string

  @column()
  public licenseNumber?: string // 🔁 pour correspondre aux données envoyées

  @column()
  public certificate?: string    // 🔁 pour correspondre aux données envoyées

  @column()
  public institution?: string    // 🔁 pour correspondre aux données envoyées

  @column()
  public address?: string        // 🔁 à ajouter pour correspondre au front

  @column()
  public specialty?: string      // 🔁 pour correspondre au front

  @column()
  public experience?: string     // 🔁 string comme envoyé depuis le front

  @column()
  public accountStatus?: Status

  @column()
  public about?: string

  @column()
  public yearsExperience?: string

  @column()
  public specialisation?: string

  @column()
  public localisation?: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @column()
  public roleId?: number

  @belongsTo(() => Role)
  public role!: BelongsTo<typeof Role>

  @hasMany(() => SessionUser)
  public sessions!: HasMany<typeof SessionUser>

  @hasMany(() => Appointment, { foreignKey: 'idUser' })
  public appointmentsAsPatient!: HasMany<typeof Appointment>

  @hasMany(() => Appointment, { foreignKey: 'idDoctor' })
  public appointmentsAsDoctor!: HasMany<typeof Appointment>

  @hasMany(() => Like, { foreignKey: 'idUser' })
  public likesSent!: HasMany<typeof Like>

  @hasMany(() => Like, { foreignKey: 'idDoctor' })
  public likesReceived!: HasMany<typeof Like>

  @hasMany(() => Experience, { foreignKey: 'idDoctor' })
  public experiences!: HasMany<typeof Experience>

  @hasMany(() => Disponibilite, { foreignKey: 'idDoctor' })
  public disponibilites!: HasMany<typeof Disponibilite>

  @hasMany(() => Notification, { foreignKey: 'idUser' })
  public notifications!: HasMany<typeof Notification>

  @hasMany(() => Feedback, { foreignKey: 'idUser' })
  public feedbacks!: HasMany<typeof Feedback>

  @hasMany(() => Suggestion, { foreignKey: 'idUser' })
  public suggestions!: HasMany<typeof Suggestion>

  @hasMany(() => Paiement, { foreignKey: 'idUser' })
  public paiements!: HasMany<typeof Paiement>

  @hasMany(() => Messages, { foreignKey: 'idUserSender' })
  public messagesSent!: HasMany<typeof Messages>

  @hasMany(() => Discussion, { foreignKey: 'idDoctor' })
  public discussionsDoctor!: HasMany<typeof Discussion>

  @hasMany(() => Discussion, { foreignKey: 'idPatient' })
  public discussionsPatient!: HasMany<typeof Discussion>

  @hasMany(() => SpecialiteDoctor, { foreignKey: 'idDoctor' })
  public specialites!: HasMany<typeof SpecialiteDoctor>

  @hasMany(() => ServiceDoctor, { foreignKey: 'idDoctor' })
  public services!: HasMany<typeof ServiceDoctor>

  @hasMany(() => DiscussionMessagery, { foreignKey: 'idUserSender' })
  public discussionMessageries!: HasMany<typeof DiscussionMessagery>

  @hasMany(() => LiveUser)
  public liveUsers!: HasMany<typeof LiveUser>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
