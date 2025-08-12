import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from './user.js'
import Creneau from './creneau.js'

export default class Disponibilite extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(disponibilite: Disponibilite) {
    disponibilite.id = randomUUID()
  }

  @column()
  public idDoctor!: string

  @column.dateTime({ columnName: 'date_debut' }) // ← ICI
  public dateDebut: DateTime | null = null

  @column.dateTime({ columnName: 'date_fin' }) // ← ICI
  public dateFin: DateTime | null = null


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
