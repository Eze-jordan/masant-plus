import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Specialite from './specialite.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SpecialiteDoctor extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idSpecialite!: number

  @column()
  public idDoctor!: number

  @belongsTo(() => Specialite, { foreignKey: 'idSpecialite' })
  public specialite!: BelongsTo<typeof Specialite>

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>
}
