import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'

export default class PasswordReset extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(passwordReset: PasswordReset) {
    passwordReset.id = randomUUID()
  }

  @column()
  public userId!: string

  @column()
  public email!: string

  @column()
  public code!: string

  @column.dateTime()
  public expiresAt!: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
