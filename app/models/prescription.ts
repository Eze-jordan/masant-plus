import { DateTime } from 'luxon'
import Appointment from './appointment.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Prescription extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(prescription: Prescription) {
    prescription.id = randomUUID()
  }

  @column()
  public idAppointment!: string

  @column()
  public label?: string

  @column()
  public duration?: string

  @column()
  public dosage?: string

  @column()
  public medications?: string

  @column()
  public instructions?: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @belongsTo(() => Appointment, {
    foreignKey: 'idAppointment',
  })
  public appointment!: BelongsTo<typeof Appointment>
}
