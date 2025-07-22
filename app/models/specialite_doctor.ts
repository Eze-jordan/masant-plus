import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Specialite from './specialite.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SpecialiteDoctor extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(specialiteDoctor: SpecialiteDoctor) {
    specialiteDoctor.id = randomUUID()
  }

  @column({ columnName: 'specialite_id' }) // 👈 match DB column
  public specialiteId!: string

  @column({ columnName: 'doctor_id' }) // 👈 match DB column
  public doctorId!: string

  @belongsTo(() => Specialite, { foreignKey: 'specialiteId' })
  public specialite!: BelongsTo<typeof Specialite>

  @belongsTo(() => User, { foreignKey: 'doctorId' })
  public doctor!: BelongsTo<typeof User>
}
