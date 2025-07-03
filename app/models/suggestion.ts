import { DateTime } from 'luxon'
import User from './user.js'
import { StatutSuggestion } from '../enum/enums.js'
import { BaseModel, belongsTo, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Suggestion extends BaseModel {
  @column({ isPrimary: true })
  public id!: string  // passer à string pour UUID

  @column({ columnName: 'idUser' }) // 👈 IMPORTANT !
  public idUser!: string

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

  @beforeCreate()
  public static assignUuid(suggestion: Suggestion) {
    suggestion.id = randomUUID()
  }
}
