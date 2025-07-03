import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { randomUUID } from 'node:crypto'

export default class SessionUser extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(session: SessionUser) {
    session.id = randomUUID()
  }

  @beforeCreate()
  public static setExpiration(session: SessionUser) {
    session.expiresAt = DateTime.now().plus({ days: 7 })
  }

  @column()
  public userId!: string

  @column()
  public token!: string

  @column.dateTime()
  public expiresAt!: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  expiresAt?: DateTime;

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>
}
