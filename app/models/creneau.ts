import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Disponibilite from './disponibilite.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Creneau extends BaseModel {
  public static table = 'creneaux'

  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(creneau: Creneau) {
    creneau.id = randomUUID()
  }

  // Propriété camelCase, colonne snake_case
  @column({ columnName: 'id_disponibilite' })
  public idDisponibilite!: string

  @column({ columnName: 'heure_debut' })
  public heureDebut!: string

  @column({ columnName: 'heure_fin' })
  public heureFin!: string

  @column()
  public disponible!: boolean

  @column.dateTime({ autoCreate: true })
public createdAt!: DateTime

@column.dateTime({ autoCreate: true, autoUpdate: true })
public updatedAt!: DateTime


  @belongsTo(() => Disponibilite, { foreignKey: 'idDisponibilite' })
  public disponibilite!: BelongsTo<typeof Disponibilite>
}
