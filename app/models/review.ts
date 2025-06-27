import { DateTime } from 'luxon'
import Appointment from './appointment.js'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idAppointment!: number

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
