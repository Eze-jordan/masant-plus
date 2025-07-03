import { DateTime } from 'luxon'
import Appointment from './appointment.js'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(review: Review) {
    review.id = randomUUID()
  }

  @column()
  public idAppointment!: string

  @column()
  public note_sur_5!: number

  @column()
  public commentaire?: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Appointment, { foreignKey: 'idAppointment' })
  public appointment!: BelongsTo<typeof Appointment>
}
