import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idDoctor!: number

  @column()
  public title!: string

  @column()
  public lieu!: string

  @column.dateTime()
  public dateDebut!: DateTime

  @column.dateTime()
  public dateFin!: DateTime

  @column()
  public description?: string

  @column()
  public poste!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>
}
