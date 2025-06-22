import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idUser!: number

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
