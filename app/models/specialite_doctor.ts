import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import Specialite from './specialite.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class SpecialiteDoctor extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(specialiteDoctor: SpecialiteDoctor) {
    specialiteDoctor.id = randomUUID()
  }

  @column()
  public idSpecialite!: string

  @column()
  public idDoctor!: string

  @belongsTo(() => Specialite, { foreignKey: 'idSpecialite' })
  public specialite!: BelongsTo<typeof Specialite>

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>
}
