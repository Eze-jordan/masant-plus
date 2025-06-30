import { DateTime } from 'luxon'
import User from './user.js'
import Message from './message.js'
import DiscussionMessagery from './discussion_messagery.js'
import { BaseModel, belongsTo, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Discussion extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(discussion: Discussion) {
    discussion.id = randomUUID()
  }

  @column()
  public idDoctor!: string

  @column()
  public idPatient!: string

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
    foreignKey: 'discussionId',
  })
  public messages!: HasMany<typeof Message>

  @hasMany(() => DiscussionMessagery, {
    foreignKey: 'discussionId',
  })
  public messagery!: HasMany<typeof DiscussionMessagery>
}
