import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Feedback extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(feedback: Feedback) {
    feedback.id = randomUUID()
  }

  @column()
  public idUser!: string

  @column()
  public sujet?: string

  @column()
  public message!: string

  @column()
  public note!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  public user!: BelongsTo<typeof User>
}
