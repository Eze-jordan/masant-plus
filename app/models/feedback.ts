import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Feedback extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idUser!: number

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
