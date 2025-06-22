import { DateTime } from 'luxon'
import User from './user.js'
import Creneau from './creneau.js'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'


export default class Disponibilite extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idDoctor!: number

  @column()
  public jour!: string

  @column()
  public heureDebut!: string

  @column()
  public heureFin!: string

  @column()
  public actif!: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>

  @hasMany(() => Creneau, { foreignKey: 'idDisponibilite' })
  public creneaux!: HasMany<typeof Creneau>
}
