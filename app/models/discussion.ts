import { DateTime } from 'luxon'
import User from './user.js'
import Message from './message.js' // Attention au pluriel, adapte selon nom exact de ton modèle
import DiscussionMessagery from './discussion_messagery.js'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Discussion extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idDoctor!: number

  @column()
  public idPatient!: number

  @column.dateTime()
  public dateChat!: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User, {
    foreignKey: 'idDoctor',
  })
  public doctor!: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'idPatient',
  })
  public patient!: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'discussionId', // adapte selon ta colonne FK dans messages
  })
  public messages!: HasMany<typeof Message>

  @hasMany(() => DiscussionMessagery, {
    foreignKey: 'discussionId', // adapte aussi ici selon ta migration
  })
  public messagery!: HasMany<typeof DiscussionMessagery>
}
