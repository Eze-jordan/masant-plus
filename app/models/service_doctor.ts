import { DateTime } from 'luxon'
import Service from './service.js'
import User from './user.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ServiceDoctor extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idService!: number

  @column()
  public idDoctor!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => Service, { foreignKey: 'idService' })
  public service!: BelongsTo<typeof Service>

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>
}
