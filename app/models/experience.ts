import { DateTime } from 'luxon'
import User from './user.js'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(experience: Experience) {
    experience.id = randomUUID()
  }

  @column()
  public idDoctor!: string

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
