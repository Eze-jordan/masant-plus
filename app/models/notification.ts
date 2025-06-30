import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(notification: Notification) {
    notification.id = randomUUID()
  }

  @column()
  public idUser!: string

  @column()
  public titre!: string

  @column()
  public description!: string

  @column()
  public isRead!: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  public user!: BelongsTo<typeof User>
}
