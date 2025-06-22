import { DateTime } from 'luxon'
import User from './user.js'
import { StatutSuggestion } from '../enum/enums.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Suggestion extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idUser!: number

  @column()
  public titre!: string

  @column()
  public description?: string

  @column()
  public statut!: keyof typeof StatutSuggestion

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  public user!: BelongsTo<typeof User>
}
