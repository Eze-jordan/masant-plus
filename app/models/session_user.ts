import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class SessionUser extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column()
  public token!: string

  @column.dateTime()
  public expiresAt!: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>

  /**
   * Définit la date d'expiration à 7 jours après la création
   */
  @beforeCreate()
  public static setExpiration(session: SessionUser) {
    session.expiresAt = DateTime.now().plus({ days: 7 })
  }
}
