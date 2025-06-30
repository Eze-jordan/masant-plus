import { DateTime } from 'luxon'
import Service from './service.js'
import User from './user.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class ServiceDoctor extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(serviceDoctor: ServiceDoctor) {
    serviceDoctor.id = randomUUID()
  }

  @column()
  public idService!: string

  @column()
  public idDoctor!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => Service, { foreignKey: 'idService' })
  public service!: BelongsTo<typeof Service>

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>
}
