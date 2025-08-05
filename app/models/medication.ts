import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Medication extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(medication: Medication) {
    medication.id = randomUUID()
  }

  @column()
  public name!: string

  @column()
  public dci!: string

  @column()
  public form!: string

  @column()
  public dosage!: string

  @column()
  public route!: string

  @column()
  public indications!: string

  @column()
  public contraindications!: string

  @column()
  public sideEffects!: string

  @column()
  public laboratory!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
