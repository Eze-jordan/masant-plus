import { DateTime } from 'luxon'
import Discussion from './discussion.js'
import User from './user.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(message: Message) {
    message.id = randomUUID()
  }

  @column()
  public idDiscussion!: string

  @column()
  public idUserSender!: string

  @column()
  public message!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Discussion, {
    foreignKey: 'idDiscussion',
  })
  public discussion!: BelongsTo<typeof Discussion>

  @belongsTo(() => User, {
    foreignKey: 'idUserSender',
  })
  public sender!: BelongsTo<typeof User>
}
