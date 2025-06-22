import { DateTime } from 'luxon'
import Disponibilite from './disponibilite.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Creneau extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idDisponibilite!: number

  @column()
  public heureDebut!: string

  @column()
  public heureFin!: string

  @column()
  public disponible!: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Disponibilite, {
    foreignKey: 'idDisponibilite',
  })
  public disponibilite!: BelongsTo<typeof Disponibilite>
}
